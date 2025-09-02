<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Currency::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $currencies = [
            ['name' => 'PKR'],
            ['name' => 'USD'],
            ['name' => 'AED'],
        ];

        foreach ($currencies as $currency) {
            Currency::create($currency);
        }
    }
}
