<?php
// app/Http/Controllers/Admin/ReportController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Training;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF;
use Carbon\Carbon;

class ReportController extends Controller
{
    // Show employee training report list
    public function index(Request $request)
    {
        $query = Employee::withCount([
            'trainings as total_trainings_count',
            'trainings as completed_trainings_count' => function ($query) {
                $query->where('employee_training.completed', true);
            }
        ])
            ->with(['trainings' => function ($query) {
                $query->where('employee_training.completed', true)
                    ->select('trainings.id', 'name', 'start_date', 'end_date');
            }]);

        // Apply filters
        if ($request->has('employee_ids') && !empty($request->employee_ids)) {
            $query->whereIn('id', $request->employee_ids);
        }

        if ($request->has('training_ids') && !empty($request->training_ids)) {
            $query->whereHas('trainings', function ($q) use ($request) {
                $q->whereIn('trainings.id', $request->training_ids);
            });
        }

        if ($request->has('start_date') && $request->start_date) {
            $query->whereHas('trainings', function ($q) use ($request) {
                $q->whereDate('start_date', '>=', $request->start_date);
            });
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereHas('trainings', function ($q) use ($request) {
                $q->whereDate('end_date', '<=', $request->end_date);
            });
        }

        $employees = $query->paginate($request->per_page ?? 15)->withQueryString();

        // Calculate total training hours for each employee
        $employees->getCollection()->transform(function ($employee) {
            $employee->total_training_hours = $employee->trainings->sum(function ($training) {
                return $training->training_hours;
            });
            return $employee;
        });

        $allEmployees = Employee::select('id', 'name', 'id_number','phone')->get();
        $allTrainings = Training::select('id', 'name')->get();

        return Inertia::render('Reports/Index', [
            'employees' => $employees,
            'allEmployees' => $allEmployees,
            'allTrainings' => $allTrainings,
            'filters' => $request->only(['employee_ids', 'training_ids', 'start_date', 'end_date', 'per_page'])
        ]);
    }

    // Show single employee report
    public function show(Employee $employee)
    {
        $employee->load(['trainings' => function ($query) {
            $query->select('trainings.*', 'employee_training.attended', 'employee_training.completed', 'employee_training.grade')
                ->withPivot('attended', 'completed', 'grade', 'feedback')
                ->orderBy('start_date', 'desc');
        }]);

        // Calculate total hours for completed trainings
        $totalHours = $employee->trainings
            ->where('pivot.completed', true)
            ->sum(function ($training) {
                return $training->training_hours;
            });

        return Inertia::render('Reports/Show', [
            'employee' => $employee,
            'totalHours' => abs($totalHours)
        ]);
    }

    // Export employee list to PDF
    public function exportList(Request $request)
    {
        $query = Employee::withCount([
            'trainings as total_trainings_count',
            'trainings as completed_trainings_count' => function ($query) {
                $query->where('employee_training.completed', true);
            }
        ])
            ->with(['trainings' => function ($query) {
                $query->where('employee_training.completed', true)
                    ->select('trainings.id', 'name', 'start_date', 'end_date');
            }]);

        // Apply filters
        if ($request->has('employee_ids') && !empty($request->employee_ids)) {
            $query->whereIn('id', $request->employee_ids);
        }

        if ($request->has('training_ids') && !empty($request->training_ids)) {
            $query->whereHas('trainings', function ($q) use ($request) {
                $q->whereIn('trainings.id', $request->training_ids);
            });
        }

        if ($request->has('start_date') && $request->start_date) {
            $query->whereHas('trainings', function ($q) use ($request) {
                $q->whereDate('start_date', '>=', $request->start_date);
            });
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereHas('trainings', function ($q) use ($request) {
                $q->whereDate('end_date', '<=', $request->end_date);
            });
        }

        $employees = $query->get()->map(function ($employee) {
            $employee->total_training_hours = $employee->trainings->sum(function ($training) {
                return $training->training_hours;
            });
            return $employee;
        });

        $data = [
            'employees' => $employees,
            'filters' => $request->only(['employee_ids', 'training_ids', 'start_date', 'end_date']),
            'report_date' => now()->format('F d, Y'),
            'total_employees' => $employees->count(),
            'total_completed_trainings' => $employees->sum('completed_trainings_count'),
            'total_training_hours' => $employees->sum('total_training_hours')
        ];

        $pdf = PDF::loadView('pdf.employee-list', $data);

        return $pdf->download('employee-training-report-' . date('Y-m-d') . '.pdf');
    }

    // Export single employee report to PDF
    public function exportEmployee(Employee $employee)
    {
        $employee->load(['trainings' => function ($query) {
            $query->select('trainings.*', 'employee_training.attended', 'employee_training.completed', 'employee_training.grade')
                ->withPivot('attended', 'completed', 'grade', 'feedback')
                ->orderBy('start_date', 'desc');
        }]);

        $totalHours = $employee->trainings
            ->where('pivot.completed', true)
            ->sum(function ($training) {
                return $training->training_hours;
            });

        $data = [
            'employee' => $employee,
            'totalHours' => $totalHours,
            'report_date' => now()->format('F d, Y'),
            'total_trainings' => $employee->trainings->count(),
            'completed_trainings' => $employee->trainings->where('pivot.completed', true)->count(),
            'attended_trainings' => $employee->trainings->where('pivot.attended', true)->count()
        ];

        $pdf = PDF::loadView('pdf.employee-detail', $data);

        return $pdf->download('employee-' . $employee->id_number ?? $employee->phone . '-training-report-' . date('Y-m-d') . '.pdf');
    }
}
