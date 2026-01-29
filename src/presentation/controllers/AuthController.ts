import { Request, Response } from 'express';
import { LoginUseCase, RefreshTokenUseCase, LogoutUseCase } from '../../application/use-cases/auth';
import { LoginDTO, RefreshTokenDTO } from '../../application/dtos';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const dto: LoginDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await this.loginUseCase.execute(dto);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const dto: RefreshTokenDTO = {
      refreshToken: req.body.refreshToken,
    };

    const result = await this.refreshTokenUseCase.execute(dto);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const dto: RefreshTokenDTO = {
      refreshToken: req.body.refreshToken,
    };

    await this.logoutUseCase.execute(dto);

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  };
}
