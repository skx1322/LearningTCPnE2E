import { Mail, Lock, HelpCircle } from "lucide-react";

const Login = () => {
  return (
<section className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-6">
        <img
          src="https://nerdantabucket0.sgp1.cdn.digitaloceanspaces.com/test/FuHua34.png"
          alt="User Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-white/50"
        />

        <h1 className="text-3xl font-medium text-white">YourUsername</h1>

        <form className="flex flex-col gap-y-4">
          <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3 w-80">
            <Mail className="text-gray-300 h-5 w-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent text-white placeholder:text-gray-300 flex-1 ml-4 outline-none"
            />
          </div>

          <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3 w-80">
            <Lock className="text-gray-300 h-5 w-5" />
            <input
              type="password"
              placeholder="Enter Password"
              className="bg-transparent text-white placeholder:text-gray-300 flex-1 ml-4 outline-none"
            />
            <HelpCircle className="text-gray-300 h-5 w-5 cursor-pointer hover:text-white" display="test"/>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600/50 hover:bg-blue-600/80 text-white font-semibold py-3 rounded-xl backdrop-blur-sm transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
