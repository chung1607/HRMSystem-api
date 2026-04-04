import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extrctTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRET_KEY')
            });
            request['user_data'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extrctTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers['authorization'];

        if (!authHeader) return undefined;

        const [type, token] = authHeader.split(' ');
        
        if (type !== 'Bearer') return undefined;
        
        return token;
    }
}