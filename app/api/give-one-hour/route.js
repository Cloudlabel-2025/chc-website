import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const full_name = formData.get('full_name')
    const linkedin = formData.get('linkedin')
    const organisation = formData.get('organisation')
    const role = formData.get('role')
    const expertise = formData.get('expertise')
    const how_to_help = formData.get('how_to_help')
    const availability = formData.get('availability')
    const format = formData.get('format')
    const anything_else = formData.get('anything_else')

    if (!full_name || !linkedin || !organisation || !role || !expertise || !how_to_help || !availability || !format) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled.' },
        { status: 400 }
      )
    }

    // TODO: Configure your email sending here
    console.log('Give One Hour submission:', { full_name, linkedin, organisation, role, expertise, how_to_help, availability, format, anything_else })

    return NextResponse.json(
      { success: true, message: 'Thank you for your interest in volunteering. We will contact you soon.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Give One Hour form error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
