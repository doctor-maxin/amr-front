import {ref} from '~/.nuxt/imports'

export const usePhoneFormat = () => {
    const phone = ref('')

    const formatPhone = (value: string) => {
        const cleanedValue = value.replace(/\D/g, '') // Remove all non-numeric characters
        const match = cleanedValue.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/) // Match the cleaned value to the expected format
        if (match) {
            phone.value = `+7 ${match[2]} ${match[3]}-${match[4]}-${match[5]}` // Format the phone number with the expected format
        } else {
            phone.value = value // If the value doesn't match the expected format, return the original value
        }
    }

    return {phone, formatPhone}
}