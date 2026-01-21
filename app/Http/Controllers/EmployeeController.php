<?php
// app/Http/Controllers/Admin/EmployeeController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
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

    public function index(Request $request): Response
    {
        $employees = $this->employeeService->getAllEmployees($request);
        $departments = $this->employeeService->getDepartment();
        // Get unique departments for filter
        return Inertia::render('Employees/Index', [
            'pageTitle' => "Employees/Staff Management",
            'employees' => $employees,
            'filters' => $request->only(['search', 'department', 'status', 'short', 'direction', 'perPage']),
            'departments' => $departments
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Employees/Create',[
            'pageTitle' => "Create New Employee/Staff"
        ]);
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $employee = $this->employeeService->createEmployee($request);
        if ($employee){
            return redirect()->route('admin.employees.index')->with('success', 'Employee updated successfully!');
        }
        return redirect()->route('admin.employees.index')->with('error', 'Error to create employee');
    }

    public function show(Employee $employee): Response
    {

        $employee->load(['trainings' => function ($query) {
            $query->withPivot('attended', 'completed', 'grade');
        }]);

        $availableTrainings = Training::whereDoesntHave('employees', function ($query) use ($employee) {
            $query->where('id_number', $employee->id);
        })->get();

        return Inertia::render('Employees/Show', [
            'pageTitle' => "Edit Employee/Staff",
            'employee' => $employee,
            'availableTrainings' => $availableTrainings
        ]);
    }

    public function edit(Employee $employee): Response
    {
        return Inertia::render('Employees/Edit', [
            'pageTitle' => "Edit Employee/Staff",
            'employee' => $employee
        ]);
    }

    public function update(Request $request, Employee $employee): RedirectResponse
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

    public function assignTraining(Request $request, Employee $employee): RedirectResponse
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

    public function removeTraining(Employee $employee, Training $training): RedirectResponse
    {
        $this->employeeService->removeTraining($employee, $training->id);

        return back()->with('success', 'Training removed from employee.');
    }
}
