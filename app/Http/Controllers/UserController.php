<?php
// app/Http/Controllers/Admin/UserController.php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{

    public function __construct(protected UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $users = $this->userService->getAllUsers(
            $request->search,
            $request->perPage ?? 10
        );

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'perPage'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'required|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|in:super-admin,admin,employee',
            'image' => 'nullable|image|max:2048',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date'
        ]);

        $this->userService->createUser($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'required|unique:users,phone,' . $user->id,
            'password' => 'nullable|min:8',
            'role' => 'required|in:super-admin,admin,employee',
            'image' => 'nullable|image|max:2048',
            'department' => 'nullable|string',
            'joining_date' => 'nullable|date'
        ]);

        $this->userService->updateUser($user, $validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->userService->deleteUser($user);

        return back()->with('success', 'User deleted successfully.');
    }
}
