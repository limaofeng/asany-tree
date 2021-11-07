import React from 'react';

export function OpenDirectory() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"
      />
    </svg>
  );
}

export function ClosedDirectory() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
      />
    </svg>
  );
}

export function Folder() {
  return (
    <svg height={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1.11-.9-2-2-2h-8l-2-2z"
        fill="#90a4ae"
      />
    </svg>
  );
}

export function File() {
  return (
    <svg height={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m5 2H6v16h12v-9h-7V4z"
        fill="#42a5f5"
      />
    </svg>
  );
}

export function FolderOpen() {
  return (
    <svg height={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 20H4c-1.11 0-2-.9-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z"
        fill="#90a4ae"
      />
    </svg>
  );
}
