<?php
// app/Http/Controllers/Admin/EmployeeController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Training;
use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(Request $request)
    {

        $employees = $this->employeeService->getAllEmployees($request);
        // Get unique departments for filter
        $departments = Employee::select('department')
            ->whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->toArray();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'department', 'status', 'sort', 'direction', 'perPage']),
            //'filters' => [],
            'departments' => $departments
        ]);
    }

    public function create()
    {
        return Inertia::render('Employees/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'employee_id' => 'required|unique:employees',
            'phone' => 'required|unique:employees',
            'email' => 'nullable|email|unique:employees',
            'designation' => 'required|string',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048'
        ]);

        $this->employeeService->createEmployee($validated);

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee)
    {
        $employee->load(['trainings' => function ($query) {
            $query->withPivot('attended', 'completed', 'grade');
        }]);

        $availableTrainings = Training::whereDoesntHave('employees', function ($query) use ($employee) {
            $query->where('employee_id', $employee->id);
        })->get();

        return Inertia::render('Admin/Employees/Show', [
            'employee' => $employee,
            'availableTrainings' => $availableTrainings
        ]);
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('Admin/Employees/Edit', [
            'employee' => $employee
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'employee_id' => 'required|unique:employees,employee_id,' . $employee->id,
            'phone' => 'required|unique:employees,phone,' . $employee->id,
            'email' => 'nullable|email|unique:employees,email,' . $employee->id,
            'designation' => 'required|string',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048'
        ]);

        $this->employeeService->updateEmployee($employee, $validated);

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $this->employeeService->deleteEmployee($employee);

        return back()->with('success', 'Employee deleted successfully.');
    }

    public function assignTraining(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'training_id' => 'required|exists:trainings,id',
            'attended' => 'boolean',
            'completed' => 'boolean',
            'grade' => 'nullable|string'
        ]);

        $this->employeeService->assignTraining($employee, $validated['training_id'], $validated);

        return back()->with('success', 'Training assigned successfully.');
    }

    public function removeTraining(Employee $employee, Training $training)
    {
        $this->employeeService->removeTraining($employee, $training->id);

        return back()->with('success', 'Training removed from employee.');
    }
}
