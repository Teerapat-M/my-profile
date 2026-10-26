import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProfileAvatar } from "@/lib/profileAvatar"

export function CommentSection({
  comment,
  onCommentChange,
  onSend,
  onRequireLogin,
  isLoggedIn,
  comments,
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold !text-black">Comment</h2>

      <form onSubmit={onSend} className="mb-8">
        <Textarea
          value={comment}
          onChange={onCommentChange}
          onFocus={() => {
            if (!isLoggedIn) onRequireLogin()
          }}
          onClick={() => {
            if (!isLoggedIn) onRequireLogin()
          }}
          readOnly={!isLoggedIn}
          placeholder="What are your thoughts?"
          className="min-h-36 resize-none rounded-xl border-gray-300 bg-white px-4 py-3 text-base shadow-none focus-visible:border-gray-400 focus-visible:ring-0"
        />
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            className="rounded-full bg-[#2b2a2a] px-8 py-2 text-sm font-medium text-white hover:bg-black"
          >
            Send
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {comments.length === 0 ? (
          <p className="text-sm text-[#757575]">No comments yet.</p>
        ) : (
          comments.map((item) => (
            <div key={item.id} className="rounded-xl bg-[#f9f9f9] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <ProfileAvatar
                  src={item.profilePic}
                  name={item.author}
                  className="size-7 text-[10px]"
                />
                <span className="font-medium text-[#43403b]">{item.author}</span>
                <span className="text-gray-300">|</span>
                <span className="text-[#757575]">{item.dateLabel}</span>
              </div>
              <p className="text-sm text-[#43403b]">{item.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
