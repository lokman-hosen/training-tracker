<?php
// database/seeders/TrainingSeeder.php
namespace Database\Seeders;

use App\Models\Training;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TrainingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trainings = [
            [
                'name' => 'Leadership Development Program',
                'topic' => 'Advanced Leadership Skills',
                'location' => 'Main Conference Hall, Building A, Government Office Complex',
                'start_date' => Carbon::now()->addDays(7)->setTime(9, 0),
                'end_date' => Carbon::now()->addDays(7)->setTime(12, 0),
                'trainer_name' => 'Dr. Sarah Johnson',
                'trainer_email' => 'sarah.johnson@training.gov',
                'trainer_phone' => '+8801712345678',
                'description' => 'A comprehensive leadership development program focusing on strategic thinking, team management, and decision-making skills for government officials.',
            ],
            [
                'name' => 'Cybersecurity Awareness',
                'topic' => 'Digital Security Best Practices',
                'location' => 'IT Training Room, 3rd Floor, ICT Department',
                'start_date' => Carbon::now()->addDays(3)->setTime(10, 30),
                'end_date' => Carbon::now()->addDays(3)->setTime(16, 30),
                'trainer_name' => 'Md. Hasan Ahmed',
                'trainer_email' => 'hasan.ahmed@cybersecurity.gov',
                'trainer_phone' => '+8801812345679',
                'description' => 'Essential cybersecurity training covering password management, phishing prevention, data protection, and secure online practices for government employees.',
            ],
            [
                'name' => 'Project Management Professional (PMP)',
                'topic' => 'Project Management Fundamentals',
                'location' => 'Seminar Room 2, Planning Division',
                'start_date' => Carbon::now()->addDays(14)->setTime(9, 0),
                'end_date' => Carbon::now()->addDays(21)->setTime(17, 0),
                'trainer_name' => 'Prof. Robert Wilson',
                'trainer_email' => 'robert.wilson@pmp.gov',
                'trainer_phone' => '+8801912345680',
                'description' => 'Intensive project management training covering all aspects of project lifecycle including initiation, planning, execution, monitoring, and closure.',
            ],
            [
                'name' => 'Effective Communication Skills',
                'topic' => 'Professional Communication',
                'location' => 'Training Center, HR Department',
                'start_date' => Carbon::now()->addDays(1)->setTime(9, 0),
                'end_date' => Carbon::now()->addDays(2)->setTime(13, 0),
                'trainer_name' => 'Fatima Begum',
                'trainer_email' => 'fatima.begum@commskills.gov',
                'trainer_phone' => '+8801612345681',
                'description' => 'Training to enhance verbal and written communication skills, public speaking, report writing, and interpersonal communication in government context.',
            ],
            [
                'name' => 'Advanced Excel for Data Analysis',
                'topic' => 'Data Management & Analysis',
                'location' => 'Computer Lab, Statistics Bureau',
                'start_date' => Carbon::now()->addDays(5)->setTime(14, 0),
                'end_date' => Carbon::now()->addDays(8)->setTime(18, 0),
                'trainer_name' => 'Aminul Islam',
                'trainer_email' => 'aminul.islam@excel.gov',
                'trainer_phone' => '+8801512345682',
                'description' => 'Hands-on training on advanced Excel features including pivot tables, formulas, data visualization, and automation for government data analysis tasks.',
            ],
        ];

        foreach ($trainings as $training) {
            Training::create($training);
        }
    }
}
