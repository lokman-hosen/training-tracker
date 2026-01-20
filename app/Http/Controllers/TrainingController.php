<?php
// app/Http/Controllers/Admin/TrainingController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Training;
use App\Models\Employee;
use App\Services\TrainingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrainingController extends Controller
{
    protected $trainingService;

    public function __construct(TrainingService $trainingService)
    {
        $this->trainingService = $trainingService;
    }

    public function index(Request $request)
    {
        $query = Training::withCount('employees');

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('topic', 'like', "%{$search}%")
                    ->orWhere('trainer_name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $now = now();
            switch ($request->status) {
                case 'upcoming':
                    $query->where('start_date', '>', $now);
                    break;
                case 'ongoing':
                    $query->where('start_date', '<=', $now)
                        ->where('end_date', '>=', $now);
                    break;
                case 'completed':
                    $query->where('end_date', '<', $now);
                    break;
            }
        }

        // Date filter
        if ($request->has('date') && $request->date) {
            $now = now();
            switch ($request->date) {
                case 'today':
                    $query->whereDate('start_date', $now);
                    break;
                case 'this_week':
                    $query->whereBetween('start_date', [
                        $now->startOfWeek(),
                        $now->endOfWeek()
                    ]);
                    break;
                case 'next_week':
                    $query->whereBetween('start_date', [
                        $now->addWeek()->startOfWeek(),
                        $now->addWeek()->endOfWeek()
                    ]);
                    break;
                case 'this_month':
                    $query->whereMonth('start_date', $now->month)
                        ->whereYear('start_date', $now->year);
                    break;
                case 'next_month':
                    $query->whereMonth('start_date', $now->addMonth()->month)
                        ->whereYear('start_date', $now->year);
                    break;
            }
        }

        // Sorting
        $sortField = $request->get('sort', 'start_date');
        $sortDirection = $request->get('direction', 'asc');

        if (in_array($sortField, ['name', 'start_date', 'end_date', 'employees_count'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('start_date', 'asc');
        }

        $trainings = $query->paginate($request->perPage ?? 10)
            ->withQueryString();

        return Inertia::render('Admin/Trainings/Index', [
            'trainings' => $trainings,
            'filters' => $request->only(['search', 'status', 'date', 'sort', 'direction', 'perPage'])
        ]);
    }

    public function create()
    {
        $employees = Employee::select('id', 'name', 'employee_id', 'department', 'image')
            ->get();

        return Inertia::render('Admin/Trainings/Create', [
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'topic' => 'required|string|max:255',
            'location' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'trainer_name' => 'required|string|max:255',
            'trainer_email' => 'required|email',
            'trainer_phone' => 'required|string',
            'description' => 'nullable|string',
            'employee_ids' => 'nullable|array',
            'employee_ids.*' => 'exists:employees,id'
        ]);

        $training = $this->trainingService->createTraining($validated);

        // Assign employees if provided
        if (isset($validated['employee_ids']) && count($validated['employee_ids']) > 0) {
            $this->trainingService->assignEmployees($training, $validated['employee_ids']);
        }

        return redirect()->route('admin.trainings.index')
            ->with('success', 'Training created successfully.');
    }

    public function show(Training $training)
    {
        $training->load(['employees' => function ($query) {
            $query->select('employees.id', 'name', 'employee_id', 'department', 'image', 'designation');
        }]);

        $availableEmployees = Employee::whereDoesntHave('trainings', function ($query) use ($training) {
            $query->where('training_id', $training->id);
        })->get(['id', 'name', 'employee_id']);

        return Inertia::render('Admin/Trainings/Show', [
            'training' => $training,
            'availableEmployees' => $availableEmployees
        ]);
    }

    public function edit(Training $training)
    {
        $training->load('employees:id,name,employee_id,department,image');

        $employees = Employee::select('id', 'name', 'employee_id', 'department', 'image')
            ->get();

        return Inertia::render('Admin/Trainings/Edit', [
            'training' => $training,
            'employees' => $employees
        ]);
    }

    public function update(Request $request, Training $training)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'topic' => 'required|string|max:255',
            'location' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'trainer_name' => 'required|string|max:255',
            'trainer_email' => 'required|email',
            'trainer_phone' => 'required|string',
            'description' => 'nullable|string',
            'employee_ids' => 'nullable|array',
            'employee_ids.*' => 'exists:employees,id'
        ]);

        $this->trainingService->updateTraining($training, $validated);

        // Sync employees
        if (isset($validated['employee_ids'])) {
            $training->employees()->sync($validated['employee_ids']);
        }

        return redirect()->route('admin.trainings.index')
            ->with('success', 'Training updated successfully.');
    }

    public function destroy(Training $training)
    {
        $this->trainingService->deleteTraining($training);

        return redirect()->route('admin.trainings.index')
            ->with('success', 'Training deleted successfully.');
    }

    public function assignEmployees(Request $request, Training $training)
    {
        $validated = $request->validate([
            'employee_ids' => 'required|array',
            'employee_ids.*' => 'exists:employees,id'
        ]);

        $this->trainingService->assignEmployees($training, $validated['employee_ids']);

        return back()->with('success', 'Employees assigned to training successfully.');
    }

    public function removeEmployee(Training $training, Employee $employee)
    {
        $this->trainingService->removeEmployee($training, $employee->id);

        return back()->with('success', 'Employee removed from training.');
    }

    public function updateEmployeeStatus(Request $request, Training $training, Employee $employee)
    {
        $validated = $request->validate([
            'attended' => 'boolean',
            'completed' => 'boolean',
            'grade' => 'nullable|string|max:10',
            'feedback' => 'nullable|string'
        ]);

        $this->trainingService->updateEmployeeStatus($training, $employee->id, $validated);

        return back()->with('success', 'Employee status updated.');
    }
}
