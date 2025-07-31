<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(10);

        return Inertia::render('Users/index', compact('users'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['required', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        try {
            if (User::create($validated_req)) {
                return back()->with('success', 'User Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating User');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            throw ValidationException::withMessages([
                'server' => 'User ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'name' => ['required'],
            'email' => ['required', 'unique:users,email,'.$id],
            ...($request->filled('password') ? ['password' => ['required', 'confirmed', 'min:8']] : []),
        ]);

        try {
            $user = User::find($id);

            if (empty($user)) {
                throw new Exception('User Not Found');
            }

            if ($user->update($validated_req)) {
                return back()->with('success', 'User Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating User');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function destroy(string $id)
    {
        try {
            if (empty($id)) {
                throw new Exception('User ID is Missing');
            }

            $user = User::find($id);

            if (empty($user)) {
                throw new Exception('User Not Found');
            }

            if ($user->delete()) {
                return back()->with('success', 'User Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting User');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('User ID is Missing');
            }

            $deleted = User::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting User');
            }

            return back()->with('success', 'User Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
