<?php
// app/Services/TrainingService.php
namespace App\Services;

use App\Models\Training;
use App\Models\Employee;

class TrainingService
{
    public function getAllTrainings($search = null, $perPage = 10)
    {
        $query = Training::withCount('employees');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('topic', 'like', "%{$search}%")
                    ->orWhere('trainer_name', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
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
            $query->select('employees.id', 'name', 'employee_id', 'designation');
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
}
