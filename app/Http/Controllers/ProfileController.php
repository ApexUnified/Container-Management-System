<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $user->append('avatar');

        return Inertia::render('Profile/index', compact('user'));
    }

    public function updateProfile(Request $request)
    {
        $validated_req = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
        ]);

        $user = Auth::user();

        $user->fill($validated_req);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($user->save()) {
            return redirect()->route('profile.index')->with('success', 'Profile updated successfully');
        } else {
            return redirect()->route('profile.index')->with('error', 'Failed to update profile');
        }
    }

    public function updatePassword(Request $request)
    {
        $validated_req = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|min:8',
            'password_confirmation' => 'required|same:password',
        ]);

        $user = Auth::user();

        if ($user->update(['password' => bcrypt($request->password)])) {
            return redirect()->route('profile.index')->with('success', 'Password updated successfully');
        } else {
            return redirect()->route('profile.index')->with('error', 'Failed to update password');
        }
    }

    public function destroyAccount(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
        ]);

        $user = Auth::user();

        if ($user->delete()) {
            Auth::logout();
            return redirect()->route('login')->with('success', 'Account Permanently deleted successfully');
        } else {
            return redirect()->route('profile.index')->withErrors(request()->all())->with('error', 'Failed to delete account');
        }
    }
}
