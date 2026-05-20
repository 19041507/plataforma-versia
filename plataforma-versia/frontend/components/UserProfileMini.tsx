export const USER_PROFILE_IMAGE = "https://plus.unsplash.com/premium_photo-1692241091501-984a8a0c35ef?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8";

export function UserProfileMini() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <img
        src={USER_PROFILE_IMAGE}
        alt="Daniel Augusto"
        className="w-10 h-10 rounded-full object-cover border border-white/10"
      />
      <div>
        <p className="text-white text-sm font-medium">Daniel Augusto</p>
        <p className="text-white/40 text-xs">daniel.augusto@empresa.com</p>
      </div>
    </div>
  );
}
