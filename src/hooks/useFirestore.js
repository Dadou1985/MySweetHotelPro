import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    buildRef,
    handleMutateAdd,
    handleMutateSet,
    handleMutateUpdate,
    handleMutateDelete,
} from '../utils/commonFunctions'


const snapshotToArray = (snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

// ─── FETCH ──────────────────────────────────────────────────────────────────

/**
 * useFirestoreQuery — fetch générique, compatible avec tous les niveaux d'imbrication.
 *
 * @param {string[]}  path        Tableau de chemin Firestore alternant collection/doc.
 *                                Le dernier segment doit être une collection (longueur impaire).
 * @param {object}    [options]   Filtres et tri optionnels.
 * @param {Array}     [options.where]   [field, operator, value]
 * @param {Array}     [options.orderBy] [field, 'asc'|'desc']
 * @param {number}    [options.limit]   Nombre max de documents (défaut 1000)
 * @param {boolean}   [options.enabled] Active/désactive la requête (défaut true)
 *
 * @example
 * // Collection racine filtrée + triée
 * useFirestoreQuery(['rooms'], { where: ['hotelId', '==', hotelId], orderBy: ['markup', 'desc'] })
 *
 * // Sous-collection
 * useFirestoreQuery(['hotels', hotelId, 'tasks'], { where: ['status', '==', 'pending'] })
 */
export const useFirestoreQuery = (path, options = {}) => {
    const {
        where: whereClause,
        orderBy: orderByClause,
        limit = 1000,
        enabled = true,
    } = options

    return useQuery({
        queryKey: [path, options],
        queryFn: () => {
            let ref = buildRef(path).where(...whereClause)
            if (orderByClause) ref = ref.orderBy(...orderByClause)
            ref = ref.limit(limit)
            return ref.get().then(snapshotToArray)
        },
        enabled: enabled && path.every(Boolean),
    })
}

// ─── MUTATIONS ───────────────────────────────────────────────────────────────

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
 * useAdd — Ajoute un document (génère un id auto) dans une collection.
 * path doit pointer vers une collection (longueur impaire).
 *
 * @example
 * const { mutate: addTask } = useAdd(['hotels', hotelId, 'tasks'], [['hotels', hotelId, 'tasks']])
 * addTask({ data: { title: 'Nettoyer chambre 12', status: 'pending' } })
 */
export const useAdd = (path, invalidateKeys) =>
    useMutate(({ data }) => handleMutateAdd(path, data), invalidateKeys)

/**
 * useSet — Crée ou écrase un document avec un id défini.
 * path doit pointer vers un document (longueur paire).
 *
 * @example
 * const { mutate: setProfile } = useSet(['hotels', hotelId], [['hotels', hotelId]])
 * setProfile({ data: { name: 'Grand Hotel', city: 'Paris' } })
 */
export const useSet = (path, invalidateKeys) =>
    useMutate(({ data }) => handleMutateSet(path, data), invalidateKeys)

/**
 * useUpdate — Met à jour des champs d'un document existant.
 * path doit pointer vers un document (longueur paire).
 *
 * @example
 * const { mutate: updateTask } = useUpdate(['hotels', hotelId, 'tasks', taskId], [['hotels', hotelId, 'tasks']])
 * updateTask({ data: { status: 'done' } })
 */
export const useUpdate = (path, invalidateKeys) =>
    useMutate(({ data }) => handleMutateUpdate(path, data), invalidateKeys)

/**
 * useDelete — Supprime un document.
 * path doit pointer vers un document (longueur paire).
 *
 * @example
 * const { mutate: deleteTask } = useDelete(['hotels', hotelId, 'tasks', taskId], [['hotels', hotelId, 'tasks']])
 * deleteTask()
 */
export const useDelete = (path, invalidateKeys) =>
    useMutate(() => handleMutateDelete(path), invalidateKeys)
