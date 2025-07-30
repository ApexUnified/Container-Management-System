<?php

namespace App\Http\Controllers;

use App\Models\GeneralSetting;
use App\Models\SmtpSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/index');
    }

    public function generalSetting()
    {
        $generalSetting = GeneralSetting::first();
        return Inertia::render('Settings/GeneralSetting/index', compact('generalSetting'));
    }

    public function updateGeneralSetting(Request $request)
    {
           $validated_req = $request->validate([
            'app_name' => 'required|min:4|string|max:100',
            'contact_email' => 'required|email',
            'contact_number' => 'required|numeric',
            ...($request->hasFile('app_main_logo_dark') ? ['app_main_logo_dark' => 'nullable|mimes:png|max:2048'] : []),
            ...($request->hasFile('app_main_logo_light') ? ['app_main_logo_light' => 'nullable|mimes:png|max:2048'] : []),
            ...($request->hasFile('app_favicon') ? ['app_favicon' => 'nullable|mimes:jpg,jpeg,png|max:2048'] : []),
        ]);

        $generalSetting = GeneralSetting::first();

        $directory = public_path('assets/images/Logo/');

        if (! file_exists($directory)) {
            File::makeDirectory($directory, 0755, true, true);
        }

        if ($request->boolean('is_removed_app_main_logo_dark') && ! $request->hasFile('app_main_logo_dark')) {
            if (! empty($generalSetting->app_main_logo_dark)) {
                if (file_exists($directory.$generalSetting->app_main_logo_dark)) {
                    File::delete($directory.$generalSetting->app_main_logo_dark);
                    $validated_req['app_main_logo_dark'] = null;
                }
            }
        }

        if ($request->boolean('is_removed_app_main_logo_light') && ! $request->hasFile('app_main_logo_light')) {

            if (! empty($generalSetting->app_main_logo_light)) {
                if (file_exists($directory.$generalSetting->app_main_logo_light)) {
                    File::delete($directory.$generalSetting->app_main_logo_light);
                    $validated_req['app_main_logo_light'] = null;
                }
            }
        }

        if ($request->boolean('is_removed_app_favicon') && ! $request->hasFile('app_favicon')) {
            if (! empty($generalSetting->app_favicon)) {
                if (file_exists($directory.$generalSetting->app_favicon)) {
                    File::delete($directory.$generalSetting->app_favicon);
                    $validated_req['app_favicon'] = null;
                }
            }
        }

        if ($request->hasFile('app_favicon')) {

            if (! empty($generalSetting->app_favicon)) {
                if (file_exists($directory.$generalSetting->app_favicon)) {
                    File::delete($directory.$generalSetting->app_favicon);
                }
            }

            $favicon = $request->file('app_favicon');
            $new_favicon_name = time().uniqid().'.'.$favicon->getClientOriginalExtension();
            $validated_req['app_favicon'] = $new_favicon_name;
            $favicon->move($directory, $new_favicon_name);

        }
        if ($request->hasFile('app_main_logo_dark')) {

            if (! empty($generalSetting->app_main_logo_dark)) {
                if (file_exists($directory.$generalSetting->app_main_logo_dark)) {
                    File::delete($directory.$generalSetting->app_main_logo_dark);
                }
            }

            $app_main_logo_dark = $request->file('app_main_logo_dark');
            $new_app_main_logo_dark_name = time().uniqid().'.'.$app_main_logo_dark->getClientOriginalExtension();
            $validated_req['app_main_logo_dark'] = $new_app_main_logo_dark_name;
            $app_main_logo_dark->move($directory, $new_app_main_logo_dark_name);

        }

        if ($request->hasFile('app_main_logo_light')) {

            if (! empty($generalSetting->app_main_logo_light)) {
                if (file_exists($directory.$generalSetting->app_main_logo_light)) {
                    File::delete($directory.$generalSetting->app_main_logo_light);
                }
            }

            $app_main_logo_light = $request->file('app_main_logo_light');
            $new_app_main_logo_light_name = time().uniqid().'.'.$app_main_logo_light->getClientOriginalExtension();
            $validated_req['app_main_logo_light'] = $new_app_main_logo_light_name;
            $app_main_logo_light->move($directory, $new_app_main_logo_light_name);

        }

        if (! empty($generalSetting)) {
            $generalSetting->update($validated_req);
        } else {
            GeneralSetting::create($validated_req);
        }

        return back()->with('success', 'General Setting Updated Successfully');
    }

    public function smtpSetting()
    {
        $smtpSetting = SmtpSetting::first();

        return Inertia::render('Settings/SMTPSetting/index', compact('smtpSetting'));
    }

    public function updateSmtpSetting(Request $request)
    {
        $validated_req = $request->validate([
            'smtp_mailer' => 'required|min:4',
            'smtp_scheme' => 'required|min:4',
            'smtp_host' => 'required',
            'smtp_port' => 'required|numeric',
            'smtp_username' => 'required|email',
            'smtp_password' => 'required',
            'smtp_mail_from_address' => 'required|email',
        ]);

        $smtpSetting = SmtpSetting::first();

        if (empty($smtpSetting)) {
            SmtpSetting::create($validated_req);
        } else {
            $smtpSetting->update($validated_req);
        }

        return back()->with('success', 'Smtp Setting Updated Successfully');

    }
}
