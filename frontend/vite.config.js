import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig( (command,mode) =>{ //This lets Vite give your configuration function information about the current environment.
  const env = loadEnv(mode, process.cwd(),"")  //cwd = current working directory, mode= development/ production

  console.log(env.VITE_DEBUG)
  return {
  plugins: [react()],
  server: {
    ...(env.VITE_DEBUG === "true" &&{
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false
      }
    }
  })
  }
}
})
