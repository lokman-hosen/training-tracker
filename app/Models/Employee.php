<?php
// app/Models/Employee.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'joining_date' => 'date',
    ];

    public function trainings()
    {
        return $this->belongsToMany(Training::class, 'employee_training')
            ->withPivot('attended', 'completed', 'grade', 'feedback')
            ->withTimestamps();
    }

    public function getTrainingHoursAttribute()
    {
        return $this->trainings->sum(function ($training) {
            return $training->training_hours;
        });
    }

    public function getCompletedTrainingsAttribute()
    {
        return $this->trainings->where('pivot.completed', true)->count();
    }
}
