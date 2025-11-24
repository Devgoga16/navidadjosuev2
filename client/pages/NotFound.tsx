import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            La página que buscas no existe. Por favor, verifica la URL o regresa
            al inicio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold"
            size="lg"
          >
            Ir al Inicio
          </Button>

          {user && (
            <Button
              onClick={() =>
                navigate(user.role === "admin" ? "/admin" : "/participant")
              }
              variant="outline"
              size="lg"
              className="font-semibold"
            >
              Volver al Panel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
