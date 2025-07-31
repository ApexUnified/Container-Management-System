<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
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

    }
}
