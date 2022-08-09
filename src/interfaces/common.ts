export type GrantType = 'password' | 'otp' | 'google' | 'facebook' | 'apple' | 'magic_token'; 

export class FoodBearError {
    httpStatus: number;
    code: string;
    message: string;

    constructor(params: { httpStatus: number, code: string, message: string }) {
        this.httpStatus = params.httpStatus;
        this.code = params.code;
        this.message = params.message;
    }
}