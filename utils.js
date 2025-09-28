export const $ = (selector, context = document) =>
    (context?.querySelector ? context.querySelector(selector) : null);

export const $$ = (selector, context = document) =>
    context?.querySelectorAll ? Array.from(context.querySelectorAll(selector)) : [];

export const norm = (value = "") =>
    value
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

export const CLP = (amount) =>
    Number(amount || 0).toLocaleString("es-CL");

export const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
