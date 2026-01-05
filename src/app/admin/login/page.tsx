import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="bg-white p-8 rounded shadow-sm w-full max-w-sm space-y-8 border border-stone-100">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-serif text-stone-800">Admin Login</h1>
                    <p className="text-xs text-stone-400">管理用パスワードを入力してください</p>
                </div>

                <form
                    action={async (formData) => {
                        "use server";
                        await signIn("credentials", formData);
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Enter admin password"
                            className="bg-stone-50"
                        />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                        ログイン
                    </Button>
                </form>
            </div>
        </div>
    );
}
