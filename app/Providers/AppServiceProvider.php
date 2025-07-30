<?php

namespace App\Providers;

use App\Models\GeneralSetting;
use App\Models\SmtpSetting;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Model::automaticallyEagerLoadRelationships();

        if (app()->environment('local')) {
            Model::shouldBeStrict();
            // Not Needed Yet
            // URL::forceRootUrl(config('app.url'));
            URL::forceScheme('http');
        } else {
            URL::forceScheme('https');
        }

        try {
            DB::connection()->getPdo();

            if (Schema::hasTable('general_settings')) {

                $general_setting = Cache::rememberForever('general_config', fn () => GeneralSetting::first() ?? null);

                if (! empty($general_setting)) {
                    Config::set('app.name', $general_setting?->app_name);
                }
            }

            if (Schema::hasTable('smtp_settings')) {
                $smtp = Cache::rememberForever('smtp_config', fn () => SmtpSetting::first() ?? null);

                if (! empty($smtp)) {
                    Config::set([
                        'mail.default' => $smtp->smtp_mailer,
                        'mail.mailers.smtp.scheme' => $smtp->smtp_scheme,
                        'mail.mailers.smtp.host' => $smtp->smtp_host,
                        'mail.mailers.smtp.port' => $smtp->smtp_port,
                        'mail.mailers.smtp.username' => $smtp->smtp_username,
                        'mail.mailers.smtp.password' => $smtp->smtp_password,
                        'mail.from.address' => $smtp->smtp_mail_from_address,
                    ]);
                }
            }

        } catch (Exception $e) {
            info($e->getMessage());
        }

    }
}
