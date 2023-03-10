export default function SuccessMessage() {
  return (
    <main className="w-full flex justify-center">
      <div className="p-10 m-4 rounded-xl text-3xl border-[1px] border-slate-900 text-slate-900">
        Congratulations! You've successfully created an account.<br/><br/>

        To continue, please <strong className="text-4xl">verify your email.</strong>
      </div>
    </main>
  )
}