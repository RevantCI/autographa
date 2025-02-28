/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, {
 useContext, useEffect, useState, useMemo,
} from 'react';
import {
  createBasicUsfmEditor, withChapterPaging,
 } from 'usfm-editor';
import * as localforage from 'localforage';
import moment from 'moment';
import { ReferenceContext } from '@/components/context/ReferenceContext';
// eslint-disable-next-line import/no-unresolved
import { readIngredients } from '@/core/reference/readIngredients';
import { ProjectContext } from '@/components/context/ProjectContext';
import { AutographaContext } from '@/components/context/AutographaContext';
import LoadingScreen from '@/components/Loading/LoadingScreen';
import { SnackBar } from '@/components/SnackBar';
import EmptyScreen from '@/components/Loading/EmptySrceen';
import { isElectron } from '../../../../core/handleElectron';

// General scroll to element function

const ReferenceBible = ({
 languageId,
  refName,
  chapter,
  verse,
  bookId,
 }) => {
  const {
    actions: {
      setRefernceLoading,
      setCounter,
    },
  } = useContext(ReferenceContext);
  const {
    states: {
      username,
    },
  } = useContext(ProjectContext);
  const {
    // states: {
    //   // activeNotificationCount,
    // },
    action: {
      setNotifications,
      // setActiveNotificationCount,
    },
  } = useContext(AutographaContext);
  // const regExp = /\(([^)]+)\)/;
    const [usfmInput, setUsfmInput] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    const [notify, setNotify] = React.useState();
    const [displyScreen, setDisplayScreen] = useState(false);

    const CustomEditor = useMemo(
      () => (withChapterPaging(createBasicUsfmEditor())),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [usfmInput],
    );

    const timeout = (ms) => {
      setIsLoading(true);
     return new Promise((resolve) => setTimeout(resolve, ms));
    };

useEffect(() => {
      if (isElectron() && refName) {
        setIsLoading(true);
        setDisplayScreen(false);
        const path = require('path');
        const newpath = localStorage.getItem('userPath');
        localforage.getItem('resources')
        .then((refs) => {
          refs.forEach((ref) => {
            setIsLoading(true);
            const _books = [];
            setDisplayScreen(false);
            if (ref.value.languages[0].name.en === languageId) {
                Object.entries(ref.value.ingredients).forEach(
                  ([key, _ingredients]) => {
                    if (_ingredients.scope) {
                      const _bookID = Object.entries(_ingredients.scope)[0][0];
                      _books.push(_bookID);
                      if (_bookID.split('-').pop() === bookId.toUpperCase() && refName !== null) {
                        const filePath = path.join(
                          newpath, 'autographa', 'users', username, 'resources', refName, key,
                        );
                        readIngredients({
                          filePath,
                        }).then((res) => {
                          timeout(2000).then(() => {
                            setUsfmInput(res);
                          }).finally(() => {
                            setIsLoading(false);
                            setOpenSnackBar(true);
                            setSnackText(`successfully loaded ${refName} files`);
                            setNotify('success');
                            setDisplayScreen(false);
                          });
                          setRefernceLoading({
                            status: true,
                            text: 'Reference-burrito loaded succesfully',
                          });
                          setCounter(4);
                        });

                        const commonResourcePath = path.join(
                          newpath, 'autographa', 'common', 'resources', refName, key,
                        );
                        readIngredients({
                          filePath: commonResourcePath,
                        }).then((res) => {
                          timeout(2000).then(() => {
                            setUsfmInput(res);
                          }).finally(() => {
                            setIsLoading(false);
                            setOpenSnackBar(true);
                            setSnackText(`successfully loaded ${refName} files`);
                            setNotify('success');
                            setDisplayScreen(false);
                          });
                          setRefernceLoading({
                            status: true,
                            text: 'Reference-burrito loaded succesfully',
                          });
                          setCounter(4);
                        });
                        // .then(() => {
                        //     localforage.getItem('notification').then((value) => {
                        //         const temp = [...value];
                        //         if (temp.length !== 0) {
                        //           temp.push({
                        //             title: 'Resources',
                        //             text: `successfully loaded ${refName} files`,
                        //             type: 'success',
                        //             time: moment().format(),
                        //             hidden: true,
                        //         });
                        //           setNotifications(temp);
                        //           setActiveNotificationCount(activeNotificationCount + 1);
                        //         }
                        //       });
                        // });
                      }
                    }
                    if (_ingredients.scope === undefined) {
                      if (_books.includes(bookId.toUpperCase()) === false) {
                        setDisplayScreen(true);
                      }
                    }
                    // console.log(key, value),
                  },
                );
            }
          });
        }).catch((err) => {
          // we got an error
            setOpenSnackBar(true);
            setSnackText(`failed to loaded ${refName} files`);
            setNotify('failure');
          localforage.getItem('notification').then((value) => {
            const temp = [...value];
            temp.push({
                title: 'Resources',
                text: `failed to loaded ${refName}`,
                type: 'failure',
                time: moment().format(),
                hidden: true,
            });
            setNotifications(temp);
          });
          throw err;
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookId, languageId, refName]);

    // seting book scope for navigation
    // localforage.getItem('refBibleBurrito')
    //   .then((refs) => {
    //     refs.forEach((ref) => {
    //       if (ref.languages[0].tag === regExp.exec(languageId)[1]) {
    //         const scope = [];
    //         Object.entries((ref.type.flavorType.currentScope)).forEach(
    //             ([key]) => {
    //               scope.push(key);
    //               console.log(scope);
    //             },
    //             );
    //           }
    //         });
    //       });

  return (
    <span>
      <>
        {usfmInput && (
        isLoading === false ? (
          <CustomEditor
            usfmString={usfmInput}
            key={usfmInput}
            readOnly
            goToVerse={{
              chapter: parseInt(chapter, 10),
              verse: parseInt(verse, 10),
              key: Date.now(),
          }}
          />
        ) : (
          displyScreen === true ? (
            <EmptyScreen />
          ) : (<LoadingScreen />)
        )
      )}
        {usfmInput === undefined && (
          displyScreen === true ? (
            <EmptyScreen />
          )
          : <LoadingScreen />
        )}
        <SnackBar
          openSnackBar={snackBar}
          snackText={snackText}
          setOpenSnackBar={setOpenSnackBar}
          setSnackText={setSnackText}
          error={notify}
        />
      </>
    </span>
  );
};

export default ReferenceBible;
