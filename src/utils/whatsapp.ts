export function generateWhatsAppLink(
  phoneNumber: string | null,
  params: { brideName: string; groomName: string; travellerName: string; message: string }
): string {
  const text = `🎊 Wedding Yatra — Join Request

Hi! I'm ${params.travellerName} and I've requested to join ${params.brideName} & ${params.groomName}'s wedding celebration on Wedding Yatra.

My message: "${params.message}"

Looking forward to being part of your special day! 🙏`

  const encodedText = encodeURIComponent(text)

  if (phoneNumber) {
    // Replace any non-numeric characters from the phone number
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    return `https://wa.me/${cleanNumber}?text=${encodedText}`
  }

  // Without a specific phone number, the user can forward it to contacts manually
  return `https://wa.me/?text=${encodedText}`
}
