import { Injectable } from '@nestjs/common';

export interface UserAccount {
    id: string;
    email: string;
    name: string;
    username: string;
    password: string; // 실제 환경에서는 해시된 비밀번호
    profile?: {
        picture?: string;
        given_name?: string;
        family_name?: string;
        locale?: string;
    };
}

export interface AccountClaims {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
    [key: string]: any; // oidc-provider 호환성을 위한 인덱스 시그니처
}

@Injectable()
export class AccountService {
    // 개발용 Mock 사용자 데이터
    private readonly users: UserAccount[] = [
        {
            id: 'user123',
            email: 'john.doe@example.com',
            name: 'John Doe',
            username: 'john.doe',
            password: 'password123', // 실제로는 해시된 비밀번호를 사용해야 함
            profile: {
                given_name: 'John',
                family_name: 'Doe',
                picture: 'https://via.placeholder.com/150',
                locale: 'en-US',
            },
        },
        {
            id: 'user456',
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            username: 'jane.smith',
            password: 'password456',
            profile: {
                given_name: 'Jane',
                family_name: 'Smith',
                picture: 'https://via.placeholder.com/150',
                locale: 'en-US',
            },
        },
        {
            id: 'admin789',
            email: 'admin@example.com',
            name: 'Administrator',
            username: 'admin',
            password: 'admin123',
            profile: {
                given_name: 'Admin',
                family_name: 'User',
                picture: 'https://via.placeholder.com/150',
                locale: 'en-US',
            },
        },
    ];

    /**
     * 사용자 인증
     */
    async authenticateUser(login: string, password: string): Promise<UserAccount | null> {
        const user = this.users.find(
            u => (u.username === login || u.email === login) && u.password === password
        );

        return user || null;
    }

    /**
     * ID로 사용자 찾기
     */
    async findById(id: string): Promise<UserAccount | null> {
        return this.users.find(u => u.id === id) || null;
    }

    /**
     * 사용자 클레임 생성 (OIDC용)
     */
    async getClaims(userId: string, scope?: string): Promise<AccountClaims | null> {
        const user = await this.findById(userId);
        if (!user) return null;

        const claims: AccountClaims = {
            sub: user.id,
        };

        // scope에 따라 클레임 추가
        const scopes = scope?.split(' ') || [];

        if (scopes.includes('email')) {
            claims.email = user.email;
            claims.email_verified = true;
        }

        if (scopes.includes('profile')) {
            claims.name = user.name;
            claims.given_name = user.profile?.given_name;
            claims.family_name = user.profile?.family_name;
            claims.picture = user.profile?.picture;
            claims.locale = user.profile?.locale;
        }

        return claims;
    }

    /**
     * 모든 사용자 목록 (개발용)
     */
    async getAllUsers(): Promise<Omit<UserAccount, 'password'>[]> {
        return this.users.map(({ password, ...user }) => user);
    }
} 