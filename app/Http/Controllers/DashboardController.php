<?php
// app/Http/Controllers/Admin/DashboardController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employee;
use App\Models\Training;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Basic Stats
        $stats = [
            'totalUsers' => User::count(),
            'totalEmployees' => Employee::count(),
            'totalTrainings' => Training::count(),
            'ongoingTrainings' => Training::where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->count(),
            'completedTrainings' => Training::where('end_date', '<', now())
                ->count(),
            'totalTrainingHours' => Training::get()->sum(function ($training) {
                return $training->training_hours;
            }),
            'activeEmployees' => Employee::has('trainings')->count(),
            'avgCompletionRate' => $this->calculateAvgCompletionRate(),
        ];

        // Upcoming Trainings (next 5)
        $upcomingTrainings = Training::withCount('employees')
            ->where('start_date', '>', now())
            ->orderBy('start_date')
            ->limit(5)
            ->get()
            ->map(function ($training) {
                return [
                    'id' => $training->id,
                    'name' => $training->name,
                    'topic' => $training->topic,
                    'start_date' => $training->start_date,
                    'end_date' => $training->end_date,
                    'trainer_name' => $training->trainer_name,
                    'participants_count' => $training->employees_count,
                ];
            });

        // Recent Activities (mock data - implement actual activity logging)
        $recentActivities = [
            [
                'type' => 'training',
                'description' => 'New training "Leadership Skills" created',
                'created_at' => now()->subHours(2),
            ],
            [
                'type' => 'employee',
                'description' => 'John Doe assigned to Cybersecurity Training',
                'created_at' => now()->subHours(4),
            ],
            [
                'type' => 'completion',
                'description' => 'Jane Smith completed Advanced Excel Training',
                'created_at' => now()->subHours(6),
            ],
            [
                'type' => 'training',
                'description' => 'Communication Skills training updated',
                'created_at' => now()->subHours(8),
            ],
        ];

        // Training Statistics
        $trainingStats = [
            'monthlyData' => $this->getMonthlyTrainingData(),
            'departmentStats' => $this->getDepartmentStats(),
            'topPerformers' => $this->getTopPerformers(),
        ];

        // Quick Stats
        $quickStats = [
            'todayTrainings' => Training::whereDate('start_date', today())->count(),
            'thisWeekCompletions' => Training::where('end_date', '>=', now()->startOfWeek())
                ->where('end_date', '<=', now()->endOfWeek())
                ->count(),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'upcomingTrainings' => $upcomingTrainings,
            'recentActivities' => $recentActivities,
            'trainingStats' => $trainingStats,
            'quickStats' => $quickStats,
        ]);
    }

    private function calculateAvgCompletionRate()
    {
        $totalTrainings = Training::count();
        if ($totalTrainings === 0) return 0;

        $completedTrainings = Training::where('end_date', '<', now())->count();
        return round(($completedTrainings / $totalTrainings) * 100);
    }

    private function getMonthlyTrainingData()
    {
        // Mock data - implement actual monthly aggregation
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return array_map(function ($month, $index) {
            return [
                'month' => $month,
                'trainings' => rand(5, 20),
                'participants' => rand(20, 100),
                'completion' => rand(70, 95),
            ];
        }, $months, array_keys($months));
    }

    private function getDepartmentStats()
    {
        // Mock department data
        return [
            [
                'name' => 'IT Department',
                'employee_count' => 24,
                'training_count' => 12,
                'completion_rate' => 85,
                'avg_hours' => 48,
                'status' => 'Excellent',
            ],
            [
                'name' => 'Human Resources',
                'employee_count' => 18,
                'training_count' => 8,
                'completion_rate' => 92,
                'avg_hours' => 36,
                'status' => 'Excellent',
            ],
            [
                'name' => 'Finance',
                'employee_count' => 15,
                'training_count' => 6,
                'completion_rate' => 78,
                'avg_hours' => 42,
                'status' => 'Good',
            ],
            [
                'name' => 'Operations',
                'employee_count' => 32,
                'training_count' => 10,
                'completion_rate' => 65,
                'avg_hours' => 28,
                'status' => 'Average',
            ],
        ];
    }

    private function getTopPerformers()
    {
        // Mock top performers
        return [
            [
                'name' => 'John Smith',
                'department' => 'IT',
                'completed_trainings' => 8,
                'completion_rate' => 100,
            ],
            [
                'name' => 'Sarah Johnson',
                'department' => 'HR',
                'completed_trainings' => 7,
                'completion_rate' => 95,
            ],
            [
                'name' => 'Michael Chen',
                'department' => 'Finance',
                'completed_trainings' => 6,
                'completion_rate' => 90,
            ],
            [
                'name' => 'Emily Davis',
                'department' => 'Operations',
                'completed_trainings' => 5,
                'completion_rate' => 85,
            ],
            [
                'name' => 'Robert Wilson',
                'department' => 'IT',
                'completed_trainings' => 5,
                'completion_rate' => 88,
            ],
        ];
    }
}
