import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="bg-white p-8 rounded shadow-sm w-full max-w-sm space-y-8 border border-stone-100 text-center">
                <h1 className="text-2xl font-serif text-stone-800">管理画面 ログイン</h1>

                <form
                    action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/admin/dashboard" });
                    }}
                >
                    <Button type="submit" className="w-full" size="lg">
                        Googleでログイン
                    </Button>
                </form>
            </div>
        </div>
    );
}
