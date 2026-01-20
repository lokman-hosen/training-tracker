<?php
// app/Services/EmployeeService.php
namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{
    public function __construct(public Employee $employee){
    //
    }
    public function getAllEmployees($request)
    {
        $query = $this->employee->withCount([
            'trainings', // Total trainings count
            'trainings as completed_trainings_count' => function ($query) {
                $query->where('completed', true); // Only completed trainings
            }
        ]);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('id_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%");
            });
        }
        // Department filter
        if ($request->has('department') && $request->department) {
            $query->where('department', $request->department);
        }

        // Sorting
        $sortField = $request->get('short', 'name');
        $sortDirection = $request->get('direction', 'asc');

        if (in_array($sortField, ['name', 'department', 'joining_date', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        return $query->latest()->paginate($request->perPage ?? 10)
            ->withQueryString();

    }

    public function createEmployee($request)
    {
//        if (isset($data['image'])) {
//            $data['image'] = $this->uploadImage($data['image']);
//        }

        return $this->employee->create($request->all());
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

    public function getDepartment()
    {
        return $this->employee->select('department')
            ->whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->toArray();
    }

    public function list()
    {
        return $this->employee->select('id', 'name', 'id_number', 'department', 'designation', 'image')
            ->get();
    }
}
