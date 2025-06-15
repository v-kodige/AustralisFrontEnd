
import { Button } from "@/components/ui/button";

const LOGIN_URL = "https://australis-energy-dev-app.azurewebsites.net/";

const LoginSection = () => {
  return (
    <section
      id="login"
      className="py-16 md:py-24 bg-anti-flash_white flex flex-col items-center justify-center"
    >
      <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-2xl shadow border border-[#e2e2ef] flex flex-col items-center">
        <h2 className="text-3xl font-bold text-delft_blue mb-4 text-center">
          Login to your Dashboard
        </h2>
        <p className="text-delft_blue/80 text-center mb-8">
          Securely access the Australis Dashboard to manage your projects and analytics.
        </p>
        <Button
          asChild
          className="w-full bg-neon_blue text-white hover:bg-neon_blue/90 text-lg py-4 px-8 rounded-full font-semibold shadow hover:shadow-lg transition"
        >
          <a
            href={LOGIN_URL}
            target="_self"
            aria-label="Login to Australis Energy Dashboard"
          >
            Login
          </a>
        </Button>
      </div>
    </section>
  );
};

export default LoginSection;
