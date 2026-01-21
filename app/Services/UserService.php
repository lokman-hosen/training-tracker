<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserService
{
    public function getAllUsers($request)
    {
        $query = User::query();
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        }

        return $query->latest()->paginate($request->perPage ?? 10)
            ->withQueryString();
    }

    public function createUser(array $data)
    {
        $data['password'] = Hash::make($data['password']);

        if (isset($data['image'])) {
            $data['image'] = $this->uploadImage($data['image']);
        }

        return User::create($data);
    }

    public function updateUser(User $user, array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['image'])) {
            if ($user->image) {
                Storage::delete($user->image);
            }
            $data['image'] = $this->uploadImage($data['image']);
        }

        return $user->update($data);
    }

    public function deleteUser(User $user)
    {
        if ($user->image) {
            Storage::delete($user->image);
        }

        return $user->delete();
    }

    private function uploadImage($image)
    {
        return $image->store('users', 'public');
    }
}
