'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  // CRITICAL: .catch() is chained to handle the async error without blocking.
  setDoc(docRef, data, options).catch(error => {
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'write', // or 'create'/'update' based on options
      requestResourceData: data,
    });
    // The listener component will throw this error, making it visible in the Next.js overlay.
    errorEmitter.emit('permission-error', permissionError);
  });
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * The promise is returned but not typically awaited, allowing the UI to remain responsive.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any): Promise<DocumentReference> {
  const promise = addDoc(colRef, data);
  
  // CRITICAL: .catch() is chained to handle the async error without blocking.
  promise.catch(error => {
      const permissionError = new FirestorePermissionError({
        path: colRef.path,
        operation: 'create',
        requestResourceData: data,
      });
      // The listener component will throw this error, making it visible in the Next.js overlay.
      errorEmitter.emit('permission-error', permissionError);
  });
  
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  // CRITICAL: .catch() is chained to handle the async error without blocking.
  updateDoc(docRef, data)
    .catch(error => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      // The listener component will throw this error, making it visible in the Next.js overlay.
      errorEmitter.emit('permission-error', permissionError);
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  // CRITICAL: .catch() is chained to handle the async error without blocking.
  deleteDoc(docRef)
    .catch(error => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      // The listener component will throw this error, making it visible in the Next.js overlay.
      errorEmitter.emit('permission-error', permissionError);
    });
}
