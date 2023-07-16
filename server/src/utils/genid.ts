import * as nanoid from 'nanoid';

// Your alphabet set
const SIMPLEalphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// generator is a function that returns a random string
// of length 10, with alphabets from the characters in `alphabet` constant 
export const genBlogId = nanoid.customAlphabet(SIMPLEalphabet, 10);
export const genCategoryId = nanoid.customAlphabet(alphabet, 7);
export const genTagId = nanoid.customAlphabet(alphabet, 6);
