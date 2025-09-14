<?php

namespace App\Http\Controllers;

use App\Models\Control;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChartOfAccountController extends Controller
{
    public function __invoke(Request $request)
    {
        $controls_with_sub_and_details = Control::with([
            'subsidaries' => function ($query) {
                $query->orderBy('code', 'asc');
            },
            'details' => function ($query) {
                $query->orderBy('code', 'asc');
            },
        ])
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($control) {
                $control->now = now()->format('d-m-Y');

                return $control;
            });

        // return $controls_with_sub_and_details;

        return Inertia::render('Reports/ChartOfAccounts/index', compact('controls_with_sub_and_details'));
    }
}
