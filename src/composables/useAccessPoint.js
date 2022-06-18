import { computed } from 'vue'
import { useRoute } from 'vue-router'

const AP_NAMES = {
    777: 'Второй Елагин Мост',
    778: 'Третий Елагин Мост',
}

export function useAccessPoint() {
    const pid = useRoute().query.ap_id
    const getAccessPointName = (id) => {
        return AP_NAMES[id] || 'Неизвестная точка'
    }
    const accessPointName = computed(() => {
        return getAccessPointName(pid)
    })
    return {
        getAccessPointName,
        accessPointName
    }
}