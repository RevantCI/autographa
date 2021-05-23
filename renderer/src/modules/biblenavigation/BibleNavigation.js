import { Dialog, Transition } from '@headlessui/react';
import {
 Fragment, useEffect, useRef, useState,
} from 'react';
import SelectBook from '@/components/EditorPage/Navigation/reference/SelectBook';
import SelectVerse from '@/components/EditorPage/Navigation/reference/SelectVerse';
import { XIcon } from '@heroicons/react/solid';
import { useBibleReference } from 'bible-reference-rcl';

export default function BibleNavigation() {
    const supportedBooks = null; // if empty array or null then all books available
    const initialBook = 'mat';
    const initialChapter = '2';
    const initialVerse = '1';

      const {
     state: {
        bookList,
        bookName,
        chapter,
        verse,
        chapterList,
        verseList,
     }, actions: {
        onChangeBook,
        onChangeChapter,
        onChangeVerse,
        applyBooksFilter,
      },
    } = useBibleReference({
        initialBook,
        initialChapter,
        initialVerse,
      });

    useEffect(() => {
        applyBooksFilter(supportedBooks);
      }, [applyBooksFilter, supportedBooks]);

    const [openBook, setOpenBook] = useState(false);
    const [openVerse, setOpenVerse] = useState(false);
    const cancelButtonRef = useRef(null);

    function closeBooks() {
      setOpenBook(false);
    }

    function openBooks() {
      setOpenBook(true);
    }

    function closeVerses() {
      setOpenVerse(false);
    }

    function selectBook() {
      setOpenBook(false);
      setOpenVerse(true);
    }

    return (
      <>
        <div className="items-center justify-center">
          <button
            type="button"
            onClick={openBooks}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-60 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            BOOK:
            {' '}
            {bookName}
          </button>
          <button
            type="button"
            onClick={selectBook}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-60 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            CHAPTER:
            {' '}
            {chapter}
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-60 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            VERSE:
            {' '}
            {verse}
          </button>
        </div>

        <Transition
          show={openBook}
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            initialFocus={cancelButtonRef}
            static
            open={openBook}
            onClose={closeBooks}
          >

            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="flex items-center justify-center h-screen ">

              <div className="w-5/12 m-auto z-50 shadow overflow-hidden sm:rounded-lg">
                <SelectBook
                  selectBook={selectBook}
                  bookList={bookList}
                  onChangeBook={onChangeBook}
                >
                  <button
                    type="button"
                    className="w-9 h-9 bg-black p-2"
                    onClick={closeBooks}
                  >
                    <XIcon />
                  </button>
                </SelectBook>
              </div>
            </div>

          </Dialog>
        </Transition>

        <Transition
          show={openVerse}
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            initialFocus={cancelButtonRef}
            static
            open={openVerse}
            onClose={closeVerses}
          >

            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="flex items-center justify-center h-screen">

              <div className=" w-3/12 m-auto z-50 bg-black text-white shadow overflow-hidden sm:rounded-lg">
                <SelectVerse
                  chapter={chapter}
                  verse={verse}
                  chapterList={chapterList}
                  verseList={verseList}
                  bookName={bookName}
                  onChangeChapter={onChangeChapter}
                  onChangeVerse={onChangeVerse}
                  closeBooks={closeBooks}
                  closeVerses={closeVerses}
                >
                  <button
                    type="button"
                    className="w-9 h-9 bg-black p-2"
                    onClick={closeVerses}
                  >
                    <XIcon />
                  </button>
                </SelectVerse>
              </div>
            </div>

          </Dialog>
        </Transition>
      </>
  );
}
