import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, Gift, Clock, User } from "lucide-react";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ParticipantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasAssignment, setHasAssignment] = useState<string | null>(null);
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);

  useEffect(() => {
    if (user?.role !== "participant") {
      navigate("/");
    }

    // Update countdown every second
    const updateCountdown = () => {
      // December 5, 2025 at 00:00:00
      const drawDate = new Date("2025-12-05T00:00:00").getTime();
      const now = new Date().getTime();
      const diff = drawDate - now;

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Try to fetch assignment if draw date has passed
        fetchAssignment();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Try to fetch assignment on load
    fetchAssignment();

    return () => clearInterval(interval);
  }, [user, navigate]);

  const fetchAssignment = async () => {
    if (!user) return;
    setIsLoadingAssignment(true);
    try {
      const response = await fetch("/api/my-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (data.assigned) {
        setHasAssignment(data.assigned);
        setShowAssignment(true);
      }
    } catch {
      // Silently fail - assignment might not be available yet
    } finally {
      setIsLoadingAssignment(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const drawDatePassed =
    countdown.days === 0 &&
    countdown.hours === 0 &&
    countdown.minutes === 0 &&
    countdown.seconds === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Amigo Secreto
            </h1>
            <p className="text-gray-600 text-sm mt-1">Panel de Participante</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Assignment Card */}
        {showAssignment && hasAssignment ? (
          <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <Gift size={24} className="text-green-600" />
                ¡Tu Asignación!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Debes comprar un regalo para:
                </p>
                <div className="bg-white rounded-lg shadow-md p-8 inline-block">
                  <User size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text">
                    {hasAssignment}
                  </p>
                </div>
                <p className="text-gray-600 mt-6 text-sm max-w-md mx-auto">
                  El sorteo ha sido realizado. Tienes asignado a {hasAssignment}.
                  ¡Prepara un regalo especial!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Waiting Card */}
            <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Clock size={24} className="text-blue-600" />
                  {drawDatePassed
                    ? "El Sorteo Ha Comenzado"
                    : "Contando los Días..."}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {drawDatePassed ? (
                    <div className="py-8">
                      <p className="text-gray-600 mb-6">
                        El sorteo ya se ha realizado. Tu asignación debería
                        estar disponible pronto.
                      </p>
                      <Button
                        onClick={fetchAssignment}
                        disabled={isLoadingAssignment}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                      >
                        {isLoadingAssignment
                          ? "Cargando..."
                          : "Ver Mi Asignación"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-8">
                        Falta poco para el sorteo del evento
                      </p>
                      <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                          <div className="text-4xl font-bold text-purple-600">
                            {String(countdown.days).padStart(2, "0")}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Días</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                          <div className="text-4xl font-bold text-purple-600">
                            {String(countdown.hours).padStart(2, "0")}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Horas</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                          <div className="text-4xl font-bold text-purple-600">
                            {String(countdown.minutes).padStart(2, "0")}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Minutos</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                          <div className="text-4xl font-bold text-purple-600">
                            {String(countdown.seconds).padStart(2, "0")}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Segundos</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-6 shadow-md inline-block">
                        <p className="text-gray-600">
                          Fecha del evento:{" "}
                          <strong className="text-gray-900">
                            5 de Diciembre de 2025
                          </strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Información del Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gift size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        ¿Qué es Amigo Secreto?
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Es un juego donde cada participante debe regalar algo a
                        la persona que le toque en el sorteo, de forma anónima o
                        sorpresa.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        ¿Cuándo se realiza el sorteo?
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        El sorteo se realizará el 5 de diciembre de 2025. Una
                        vez realizado, podrás ver a quién le debes comprar el
                        regalo.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        ¿Cómo participo?
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Ya estás registrado. Solo espera a que se realice el
                        sorteo y verás a quién te tocó en esta página.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
