<?php
// app/Services/EmployeeService.php
namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
    public function getAllEmployees($search = null, $perPage = 10)
    {
        $query = Employee::withCount('trainings');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function createEmployee(array $data)
    {
//        if (isset($data['image'])) {
//            $data['image'] = $this->uploadImage($data['image']);
//        }

        return Employee::create($data);
    }

    public function updateEmployee(Employee $employee, array $data)
    {
        if (isset($data['image'])) {
            if ($employee->image) {
                Storage::delete($employee->image);
            }
            $data['image'] = $this->uploadImage($data['image']);
        }

        return $employee->update($data);
    }

    public function deleteEmployee(Employee $employee)
    {
        if ($employee->image) {
            Storage::delete($employee->image);
        }

        return $employee->delete();
    }

    private function uploadImage($image)
    {
        return $image->store('employees', 'public');
    }

    public function assignTraining(Employee $employee, $trainingId, $data = [])
    {
        return $employee->trainings()->syncWithoutDetaching([
            $trainingId => $data
        ]);
    }

    public function removeTraining(Employee $employee, $trainingId)
    {
        return $employee->trainings()->detach($trainingId);
    }
}
