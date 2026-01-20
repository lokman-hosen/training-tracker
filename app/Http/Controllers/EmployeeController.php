<?php
// app/Http/Controllers/Admin/EmployeeController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Training;
use App\Services\EmployeeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(Request $request)
    {

        $pageTitle = "Employees/Staff Management";
        $employees = $this->employeeService->getAllEmployees($request);
        $departments = $this->employeeService->getDepartment();
        // Get unique departments for filter
        return Inertia::render('Employees/Index', [
            'pageTitle' => $pageTitle,
            'employees' => $employees,
            'filters' => $request->only(['search', 'department', 'status', 'short', 'direction', 'perPage']),
            'departments' => $departments
        ]);
    }

    public function create(): Response
    {
        $pageTitle = "Create New Employee/Staff";
        return Inertia::render('Employees/Create',[
            'pageTitle' => $pageTitle
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'id_number' => 'required|unique:employees',
            'phone' => 'required|unique:employees',
            'email' => 'nullable|email|unique:employees',
            'designation' => 'required|string',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048'
        ]);

        $employee = $this->employeeService->createEmployee($validated);
        if ($employee){
            return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully!');
        }
        return redirect()->route('admin.employees.index')->with('error', 'Error to create employee');
    }

    public function show(Employee $employee)
    {
        $employee->load(['trainings' => function ($query) {
            $query->withPivot('attended', 'completed', 'grade');
        }]);

        $availableTrainings = Training::whereDoesntHave('employees', function ($query) use ($employee) {
            $query->where('id_number', $employee->id);
        })->get();

        return Inertia::render('Admin/Employees/Show', [
            'employee' => $employee,
            'availableTrainings' => $availableTrainings
        ]);
    }

    public function edit(Employee $employee)
    {
        $pageTitle = "Edit Employee/Staff";
        return Inertia::render('Employees/Edit', [
            'pageTitle' => $pageTitle,
            'employee' => $employee
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'id_number' => 'required|unique:employees,id_number,' . $employee->id,
            'phone' => 'required|unique:employees,phone,' . $employee->id,
            'email' => 'nullable|email|unique:employees,email,' . $employee->id,
            'designation' => 'required|string',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048'
        ]);

        $employee = $this->employeeService->updateEmployee($employee, $validated);
        if ($employee){
            return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully!');
        }
        return redirect()->route('admin.employees.index')->with('error', 'Error to create employee');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $employee = $this->employeeService->deleteEmployee($employee);
        if ($employee){
            return redirect()->route('admin.employees.index')->with('success', 'Employee deleted successfully!');
        }
        return redirect()->route('admin.employees.index')->with('error', 'Error to delete employee');
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
