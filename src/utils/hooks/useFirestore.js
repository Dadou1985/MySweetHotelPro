import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '../../config/Firebase'
import {
    handleMutateAdd,
    handleMutateSet,
    handleMutateUpdate,
    handleMutateDelete,
} from '../commonFunctions'

// ─── helpers ────────────────────────────────────────────────────────────────

const buildRef = (path) => {
    if (!Array.isArray(path) || path.length === 0)
        throw new Error('buildRef: path must be a non-empty array')

    let ref = db.collection(path[0])
    for (let i = 1; i < path.length; i++) {
        ref = i % 2 === 1 ? ref.doc(path[i]) : ref.collection(path[i])
    }
    return ref
}

const snapshotToArray = (snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

const applyOptions = (ref, { where: w, orderBy: o, limit: l = 1000 }) => {
    if (w) ref = ref.where(...w)
    if (o) ref = ref.orderBy(...o)
    return ref.limit(l)
}

// ─── FETCH (one-time) ────────────────────────────────────────────────────────

/**
 * useFirestoreQuery — lecture ponctuelle (get).
 *
 * @param {string[]} path     Chemin Firestore alternant collection/doc. Doit finir sur une collection (longueur impaire).
 * @param {object}   options
 * @param {Array}    [options.where]   [field, operator, value]
 * @param {Array}    [options.orderBy] [field, 'asc'|'desc']
 * @param {number}   [options.limit]   Défaut 1000
 * @param {boolean}  [options.enabled] Défaut true
 *
 * @example
 * const { data: rooms = [] } = useFirestoreQuery(
 *   ['hotels', hotelId, 'rooms'],
 *   { where: ['status', '==', 'clean'], orderBy: ['markup', 'desc'] }
 * )
 */
export const useFirestoreQuery = (path, options = {}) => {
    const { enabled = true, ...queryOptions } = options
    return useQuery({
        queryKey: [path, queryOptions],
        queryFn: () => applyOptions(buildRef(path), queryOptions).get().then(snapshotToArray),
        enabled: enabled && path.every(Boolean),
    })
}

// ─── FETCH (real-time) ───────────────────────────────────────────────────────

/**
 * useFirestoreSubscription — écoute temps réel (onSnapshot).
 * Met à jour le cache TanStack Query à chaque changement Firestore.
 * Utilise ce hook à la place de useFirestoreQuery quand tu as besoin de données live.
 *
 * @param {string[]} path     Chemin Firestore alternant collection/doc. Doit finir sur une collection (longueur impaire).
 * @param {object}   options  Mêmes options que useFirestoreQuery.
 *
 * @example
 * const { data: tasks = [], isLoading } = useFirestoreSubscription(
 *   ['hotels', hotelId, 'tasks'],
 *   { where: ['status', '==', 'pending'], orderBy: ['markup', 'desc'] }
 * )
 */
export const useFirestoreSubscription = (path, options = {}) => {
    const queryClient = useQueryClient()
    const { enabled = true, ...queryOptions } = options
    const queryKey = [path, queryOptions]
    const isReady = enabled && path.every(Boolean)

    useEffect(() => {
        if (!isReady) return

        const unsubscribe = applyOptions(buildRef(path), queryOptions).onSnapshot(
            (snapshot) => queryClient.setQueryData(queryKey, snapshotToArray(snapshot)),
            (err) => console.error('useFirestoreSubscription error:', err)
        )

        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path.join('|'), JSON.stringify(queryOptions), isReady])

    return useQuery({
        queryKey,
        queryFn: () => Promise.resolve(queryClient.getQueryData(queryKey) ?? []),
        staleTime: Infinity,
        enabled: isReady,
    })
}

// ─── MUTATIONS ───────────────────────────────────────────────────────────────

/**
 * invalidateKeys : tableau de paths à invalider après succès.
 * Chaque entrée est un path array, ex: [['hotels', hotelId, 'tasks']]
 */
const useMutate = (mutationFn, invalidateKeys = []) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn,
        onSuccess: () => {
            invalidateKeys.forEach((key) =>
                queryClient.invalidateQueries({ queryKey: [key] })
            )
        },
    })
}

/**
 * useAdd — Ajoute un document (id auto) dans une collection.
 * Le path doit finir sur une collection (longueur impaire).
 *
 * @example
 * const { mutate: addTask } = useAdd([['hotels', hotelId, 'tasks']])
 * addTask({ path: ['hotels', hotelId, 'tasks'], data: { title: 'Clean room 12' } })
 */
export const useAdd = (invalidateKeys) =>
    useMutate(({ path, data }) => handleMutateAdd(path, data), invalidateKeys)

/**
 * useSet — Crée ou écrase un document avec un id défini.
 * Le path doit finir sur un document (longueur paire).
 *
 * @example
 * const { mutate: setHotel } = useSet([['hotels']])
 * setHotel({ path: ['hotels', hotelId], data: { name: 'Grand Hotel' } })
 */
export const useSet = (invalidateKeys) =>
    useMutate(({ path, data }) => handleMutateSet(path, data), invalidateKeys)

/**
 * useUpdate — Met à jour des champs d'un document existant.
 * Le path doit finir sur un document (longueur paire).
 *
 * @example
 * const { mutate: updateTask } = useUpdate([['hotels', hotelId, 'tasks']])
 * updateTask({ path: ['hotels', hotelId, 'tasks', taskId], data: { status: 'done' } })
 */
export const useUpdate = (invalidateKeys) =>
    useMutate(({ path, data }) => handleMutateUpdate(path, data), invalidateKeys)

/**
 * useDelete — Supprime un document.
 * Le path doit finir sur un document (longueur paire).
 *
 * @example
 * const { mutate: deleteTask } = useDelete([['hotels', hotelId, 'tasks']])
 * deleteTask({ path: ['hotels', hotelId, 'tasks', taskId] })
 */
export const useDelete = (invalidateKeys) =>
    useMutate(({ path }) => handleMutateDelete(path), invalidateKeys)
