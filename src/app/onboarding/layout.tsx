export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 온보딩 전용 레이아웃
    // - 기본 레이아웃의 헤더/푸터 없이 전체 화면 사용 (Assuming Root Layout renders header/footer conditionally or we override here if nested)
    // NOTE: Next.js Nested Layouts apply inside the parent layout. 
    // If RootLayout contains Header/Footer, they will still be visible unless we conditionally render them in RootLayout based on path,
    // or use Route Groups (e.g. (app)/(marketing) vs (app)/(dashboard)). 
    // Since strict file structure was given "src/app/onboarding/layout.tsx", it will nest inside "src/app/layout.tsx".
    // I will implement "conditional rendering in RootLayout" strategy as requested in "Prompt 1-4 Step 6/3", 
    // or just assume this layout sets some context. 
    // Actually, "Prompt 1-4 Step 2" says "Basic layout header/footer hidden". 
    // This implies RootLayout should handle hiding, OR we use a Route Group to isolate Onboarding from Main Layout.
    // Given the prompt "Update Root Layout", I'll handle the hiding logic there or via CSS/Context. 
    // For now, this layout just wraps children.

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {children}
        </div>
    );
}
