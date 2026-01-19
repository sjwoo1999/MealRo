import Link from 'next/link';

export default function MyPage() {
    const menuItems = [
        { name: '프로필 수정', path: '/mypage/profile' },
        { name: '목표 설정', path: '/mypage/goals' },
        { name: '기기 연동', path: '/mypage/connections' },
        { name: '알림 설정', path: '/mypage/notifications' },
        { name: '데이터 관리', path: '/mypage/data' },
        { name: '설정', path: '/mypage/settings' },
    ];

    return (
        <div className="p-4 pb-24">
            <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
            <div className="space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className="block p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
