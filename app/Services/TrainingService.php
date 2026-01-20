<?php
// app/Services/TrainingService.php
namespace App\Services;

use App\Models\Training;
use App\Models\Employee;

class TrainingService
{
    public function __construct(public Training $training){
        //
    }
    public function getAllTrainings($request)
    {
        $query = $this->training->withCount('employees');
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
        $sortField = $request->get('short', 'start_date');
        $sortDirection = $request->get('direction', 'asc');

        if (in_array($sortField, ['name', 'start_date', 'end_date', 'employees_count'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('start_date', 'asc');
        }

        return $query->latest()->paginate($request->perPage ?? 10)
            ->withQueryString();
    }

    public function createTraining(array $data)
    {
        return Training::create($data);
    }

    public function updateTraining(Training $training, array $data)
    {
        return $training->update($data);
    }

    public function deleteTraining(Training $training)
    {
        return $training->delete();
    }

    public function getTrainingWithEmployees($trainingId)
    {
        return Training::with(['employees' => function ($query) {
            $query->select('employees.id', 'name', 'id_number', 'designation');
        }])->findOrFail($trainingId);
    }

    public function assignEmployees(Training $training, array $employeeIds, $data = [])
    {
        $syncData = [];
        foreach ($employeeIds as $employeeId) {
            $syncData[$employeeId] = $data;
        }

        return $training->employees()->syncWithoutDetaching($syncData);
    }

    public function removeEmployee(Training $training, $employeeId)
    {
        return $training->employees()->detach($employeeId);
    }

    public function updateEmployeeStatus(Training $training, $employeeId, $statusData)
    {
        return $training->employees()->updateExistingPivot($employeeId, $statusData);
    }

    public function getTrainingStats()
    {
        $now = now();

        return [
            'total' => Training::count(),
            'upcoming' => Training::where('start_date', '>', $now)->count(),
            'ongoing' => Training::where('start_date', '<=', $now)
                ->where('end_date', '>=', $now)
                ->count(),
            'completed' => Training::where('end_date', '<', $now)->count(),
        ];
    }
}
