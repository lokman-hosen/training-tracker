<?php
// app/Models/Training.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Training extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_training')
            ->withPivot('attended', 'completed', 'grade', 'feedback')
            ->withTimestamps();
    }

    public function getTrainingHoursAttribute()
    {
        if ($this->start_date && $this->end_date) {
            return $this->end_date->diffInHours($this->start_date);
        }
        return 0;
    }

    public function getDurationAttribute()
    {
        if ($this->start_date && $this->end_date) {
            $days = $this->end_date->diffInDays($this->start_date);
            return $days . ' day' . ($days > 1 ? 's' : '');
        }
        return 'N/A';
    }

    public function getParticipantsCountAttribute()
    {
        return $this->employees()->count();
    }

    public function getCompletedParticipantsAttribute()
    {
        return $this->employees()->wherePivot('completed', true)->count();
    }
}
