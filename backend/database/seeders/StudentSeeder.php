<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        Student::create([
            'name' => 'Tashi Norbu',
            'email' => 'tashi@example.com',
            'phone' => '9876543210',
            'course' => 'MCA',
        ]);

        Student::create([
            'name' => 'Sonam Dolma',
            'email' => 'sonam@example.com',
            'phone' => '9876543211',
            'course' => 'BCA',
        ]);

        Student::create([
            'name' => 'Karma Wangchuk',
            'email' => 'karma@example.com',
            'phone' => '9876543212',
            'course' => 'MCA',
        ]);

        Student::create([
            'name' => 'Pema Lhamo',
            'email' => 'pema@example.com',
            'phone' => '9876543213',
            'course' => 'MBA',
        ]);

        Student::create([
            'name' => 'Dorjee Tsering',
            'email' => 'dorjee@example.com',
            'phone' => '9876543214',
            'course' => 'BCA',
        ]);

        Student::create([
            'name' => 'Lobsang Tenzin',
            'email' => 'lobsang@example.com',
            'phone' => '9876543215',
            'course' => 'MCA',
        ]);

        Student::create([
            'name' => 'Yangchen Dolkar',
            'email' => 'yangchen@example.com',
            'phone' => '9876543216',
            'course' => 'BBA',
        ]);

        Student::create([
            'name' => 'Ngawang Choedon',
            'email' => 'ngawang@example.com',
            'phone' => '9876543217',
            'course' => 'MCA',
        ]);
    }
}