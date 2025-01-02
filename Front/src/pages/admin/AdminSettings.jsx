import React from "react"
import styled from "styled-components"

const SettingsContainer = styled.div`
  padding: 20px;
  background-color: #1e1e2f;
  color: white;
  min-height: 100vh;
`

const Section = styled.div`
  margin-bottom: 20px;
`

const SectionTitle = styled.h3`
  color: #ff6f61;
  margin-bottom: 10px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const Button = styled.button`
  padding: 10px 20px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e65b50;
  }
`

const AdminSettings = () => {
  return (
    <SettingsContainer>
      <h2>Settings</h2>
      <p>Here you can update site settings.</p>

      {/* Site Settings */}
      <Section>
        <SectionTitle>Site Settings</SectionTitle>
        <Label>Site Name</Label>
        <Input type="text" placeholder="Enter site name" />
        <Label>Logo URL</Label>
        <Input type="text" placeholder="Enter logo URL" />
        <Button>Save Changes</Button>
      </Section>

      {/* User Management */}
      <Section>
        <SectionTitle>User Management</SectionTitle>
        <Label>Default Role</Label>
        <Input type="text" placeholder="Enter default role (e.g., User)" />
        <Button>Update</Button>
      </Section>

      {/* Email Settings */}
      <Section>
        <SectionTitle>Email Settings</SectionTitle>
        <Label>Admin Email</Label>
        <Input type="email" placeholder="Enter admin email" />
        <Label>SMTP Server</Label>
        <Input type="text" placeholder="Enter SMTP server" />
        <Button>Save Email Settings</Button>
      </Section>
    </SettingsContainer>
  )
}

export default AdminSettings
