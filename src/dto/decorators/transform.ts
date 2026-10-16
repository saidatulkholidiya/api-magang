import { TransformFnParams } from "class-transformer";
import { Transform } from "class-transformer";

function trimValue({ value }: TransformFnParams): unknown {
    return typeof value === "string" ? value.trim() : value;
}

function lowercaseValue({ value }: TransformFnParams): unknown {
    return typeof value === "string" ? value.toLowerCase() : value;
}

function uppercaseValue({ value }: TransformFnParams): unknown {
    return typeof value === "string" ? value.toUpperCase() : value;
}

function booleanValue({ value }: TransformFnParams): unknown {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return value;
}

export const Trim = () => Transform(trimValue);
export const KeHurufKecil = () => Transform(lowercaseValue);
export const KeHurufBesar = () => Transform(uppercaseValue);
export const KeBoolean = () => Transform(booleanValue);