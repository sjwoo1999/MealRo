'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';

export default function ProfileEditPage() {
    const [formData, setFormData] = useState({
        name: '김밀로',
        birthdate: '1995-05-15',
        gender: 'female',
        height: '165',
        weight: '52',
        ffm: '38', // Optional
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10">
                <div className="flex items-center h-14 px-4">
                    <Link href="/mypage" className="p-2 -ml-2">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold ml-2">프로필 수정</h1>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-6">
                {/* Profile Image (Placeholder) */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl">
                        👤
                    </div>
                    <button className="text-sm text-emerald-500 font-medium">사진 변경</button>
                </div>

                <div className="space-y-4">
                    <Input
                        label="이름 (닉네임)"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="생년월일"
                            name="birthdate"
                            type="date"
                            value={formData.birthdate}
                            onChange={handleChange}
                        />
                        <Select
                            label="성별"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            options={[
                                { value: 'male', label: '남성' },
                                { value: 'female', label: '여성' },
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="키 (cm)"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleChange}
                        />
                        <Input
                            label="몸무게 (kg)"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                        />
                    </div>

                    <Input
                        label="골격근량/제지방량 (kg) - 선택"
                        name="ffm"
                        type="number"
                        value={formData.ffm}
                        onChange={handleChange}
                        hint="입력 시 KDRI 정밀 공식을 사용합니다."
                    />
                </div>

                <div className="pt-4">
                    <Button fullWidth onClick={() => alert('Saved!')}>저장하기</Button>
                </div>
            </main>
        </div>
    );
}
