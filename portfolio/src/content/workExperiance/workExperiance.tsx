import { useEffect, type ReactNode } from 'react';
import usePortfolioCollection from '../../components/Hooks/usePortfolioCollection';
import workExperianceStyles from './workExperence.module.css';
import { usePortfolioModelWithSilent } from '../../components/Hooks/usePortfolioModel';
import { differenceInDays, format, isBefore } from 'date-fns';

import HeaderText from '../../components/HeaderText/HeaderText';
import H3Rotate from '../../components/RotationAnimation/Rotate';
import Loader from '../../components/Loader/Loader';
import { configs } from '../../components/utils/application.config';

//#region types
type WorkExperiancePropsType = {
    SourceID: number;
    ViewType: 'brief' | 'detailed';
};

type WorkExperienceType = {
    ExperienceID: number;
    CompanyID: number;
    CompanyName: string;
    PositionID: number;
    TechnologyIDs: string;
    Technologies: string;
    Position: string;
    BriefDescription: string;
    StartDate: string;
    EndDate: string | null
    IsProjectDetailsAvailable: boolean;
    LogoImg: string;
};

type ProjectsType = {
    ProjectID: number;
    ProjectName: string;
    Description: string;
    TechnologyIDs: string;
    Technologies: string;
    StartDate: string;
    EndDate: string | null;
};

type ExperienceViewTypeProps = WorkExperienceType & { Projects: ProjectsType[] | null };

type CompanyFormulatedExperience = {
    Type: 'company';
    CompanyID: number;
};
type PositionFomulatedExperience = {
    Type: 'position';
    CompanyID: number;
    PositionID: number;
}
type FomulatedExperienceType = CompanyFormulatedExperience | PositionFomulatedExperience;
//#endregion

//#region collections
const workExperience: WorkExperienceType[] = [
    {
        ExperienceID: 1,
        CompanyID: 1,
        CompanyName: 'Vitalhub',
        PositionID: 1,
        Position: 'Trainee Software Engineer',
        TechnologyIDs: '1,2,3',
        Technologies: 'Backbone,C#,Typescript',
        BriefDescription: 'This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here.',
        StartDate: '2024-12-01',
        EndDate: null,
        IsProjectDetailsAvailable: true,
        LogoImg: '',
    },
    {
        ExperienceID: 2,
        CompanyID: 1,
        CompanyName: 'Vitalhub',
        PositionID: 3,
        Position: 'Intern Software Engineer',
        TechnologyIDs: '1,2,3',
        Technologies: 'Backbone,C#,Typescript',
        BriefDescription: 'This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here.',
        StartDate: '2024-05-11',
        EndDate: '2024-12-01',
        IsProjectDetailsAvailable: true,
        LogoImg: '',
    },
    {
        ExperienceID: 3,
        CompanyID: 2,
        CompanyName: 'Breascia Grameen',
        PositionID: 2,
        Position: 'Recovery Officer',
        TechnologyIDs: '5,7,9',
        Technologies: 'Office package,loan officer,court details handling',
        BriefDescription: 'This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here.',
        StartDate: '2020-12-01',
        EndDate: '2021-12-01',
        IsProjectDetailsAvailable: false,
        LogoImg: '',
    },
];

const projects: ProjectsType[] = [
    {
        ProjectID: 1,
        ProjectName: 'CaseWORKS',
        Description: 'This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here. This is a dummy brief experience which I expects to display here and hope to set here.',
        TechnologyIDs: '1,2,3',
        Technologies: 'Backbone,C#,Typescript',
        StartDate: '2024-05-11',
        EndDate: null,
    }
];

async function fetchBriefExperiences(): Promise<WorkExperienceType[]> {
    return workExperience;
}

async function fetchProjects(experienceID: number): Promise<ProjectsType[]> {
    if(experienceID === 1) {
        return projects;
    } else return projects;
}
//#endregion

//#region object handlers
class Experience {
    private experiences: ExperienceViewTypeProps[] = [];
    private groupedExperiences: Record<string, ExperienceViewTypeProps[]> | null = null;
    private experienceCount: {
        CompanyID: number;
        CompanyExperience: number;
        ProjectwiseExperience: { [ProjectID: number]: number };
    }[] | null = null;

    constructor(experiences: WorkExperienceType[] | null) {
        if(experiences) this.prepareExperiences(experiences);
    }

    get preparedExperience() {
        return this.experiences;
    }

    get groupedExperience(): Record<string, ExperienceViewTypeProps[]> {
        if(!this.groupedExperiences) {
            this.setGroupedExperience();
            return this.groupedExperiences!;
        } else return this.groupedExperiences!;
    }

    getTechnologies(technology: string, technologyIds: string) {
        const preparedTechnology: {ID: number, Technology: string}[] = [];
        const technologies = technology.split(',');
        const Ids = technologyIds.split(',');
        if(technologies.length === Ids.length) {
            technologies.map((technology, index) => {
                preparedTechnology.push({
                    ID: Number(Ids[index]),
                    Technology: technology,
                });
            });
        }

        return preparedTechnology;
    }

    getFormulatedExperiences(attributes: FomulatedExperienceType): string {
        if(!this.experiences) return '';
        if(!this.experienceCount) this.calculateExperience();

        //now let's calcuate the experience we have
        const companyIndex = this.experienceCount!.findIndex(item => item.CompanyID === attributes.CompanyID);
        if(attributes.Type === 'company' && companyIndex >= 0) {
            return this.experienceInMonthsAndYears(this.experienceCount![companyIndex].CompanyExperience);
        } else if (attributes.Type === 'position' && companyIndex >= 0 && this.experienceCount![companyIndex].ProjectwiseExperience[attributes.PositionID]) {
            const company = this.experiences.filter(com => com.PositionID === attributes.PositionID);
            const fomulatedExperience = this.experienceInMonthsAndYears(this.experienceCount![companyIndex].ProjectwiseExperience[attributes.PositionID]);

            if(company[0].EndDate) {
                return fomulatedExperience;
            }
            return fomulatedExperience + ' - Present';
        }
        return '';
    }

    includeProjectsToExperience(ExperienceID: number, fetchedProjects: ExperienceViewTypeProps['Projects']) {
        // first we have to find the respective experience
        let foundIndex = -1;
        this.experiences.map((experience, index) => {
            if(experience.ExperienceID === ExperienceID) {
                foundIndex = index;
            }
        });

        if(this.experiences && foundIndex > -1 && fetchedProjects) {
            this.experiences[foundIndex].Projects = fetchedProjects;
        }
    }

    private prepareExperiences(experiences: WorkExperienceType[]) {
        const preparedExperiencesView: ExperienceViewTypeProps[] = [];

        experiences.forEach(experience => {
            preparedExperiencesView.push({
                ...experience,
                Projects: null,
            });
        });

        this.experiences = preparedExperiencesView;
        this.groupedExperiences = null;
    }

    private setGroupedExperience(){
        if(!this.groupedExperiences) {
            const groupedItems = this.experiences.reduce((acc, item) => {
                (acc[item.CompanyID] = acc[item.CompanyID] || []).push(item);
                return acc;
            }, {} as Record<string, typeof this.experiences>);
            this.groupedExperiences = groupedItems;
        }
    }

    private calculateExperience() {
        if(this.experiences) {
            const preparedExperienceCounts: typeof this.experienceCount = [];

            this.experiences.forEach(experience => {
                const companyIndex = preparedExperienceCounts.findIndex(item => item.CompanyID === experience.CompanyID);
                if(experience.EndDate) {
                    if(isBefore(new Date(experience.StartDate), new Date(experience.EndDate))) {
                        const dateDifferences = differenceInDays(experience.EndDate, experience.StartDate);
                        if(companyIndex >= 0) {
                            preparedExperienceCounts[companyIndex].CompanyExperience += dateDifferences;
                            // now we have to update the positions as well
                            const prevPositionCount = preparedExperienceCounts[companyIndex].ProjectwiseExperience[experience.PositionID] || 0;
                            preparedExperienceCounts[companyIndex].ProjectwiseExperience[experience.PositionID] = prevPositionCount + dateDifferences;
                        } else {
                            preparedExperienceCounts.push({
                                CompanyID: experience.CompanyID,
                                CompanyExperience: dateDifferences,
                                ProjectwiseExperience: {
                                    [experience.PositionID]: dateDifferences,
                                },
                            });
                        }
                    }
                } else {
                    const dateDifferences = differenceInDays(new Date(), experience.StartDate);
                    if(companyIndex >= 0) {
                        preparedExperienceCounts[companyIndex].CompanyExperience += dateDifferences;
                        if(preparedExperienceCounts[companyIndex].ProjectwiseExperience[experience.PositionID]) {
                            preparedExperienceCounts[companyIndex].ProjectwiseExperience[experience.PositionID] += dateDifferences;
                        }
                    } else {
                        preparedExperienceCounts.push({
                            CompanyID: experience.CompanyID,
                            CompanyExperience: dateDifferences,
                            ProjectwiseExperience: {
                                [experience.PositionID]: dateDifferences
                            }
                        });
                    }
                }
            });

            this.experienceCount = preparedExperienceCounts;
        }
    }

    private experienceInMonthsAndYears(experienceInDays: number): string {
        if(experienceInDays < 30) return `${experienceInDays} Days`;
        else if (experienceInDays < 360) {
            return Math.floor(experienceInDays / 30) + ' Months';
        } else {
            if(experienceInDays % 360 < 150) {
                const result = Math.floor(experienceInDays / 360);
                return result === 1 ? result + ' Year' : result + ' Years';
            } else {
                const yearsCount = Math.floor(experienceInDays / 360);
                const monthsCount = Math.floor((experienceInDays % 360) / 30);
                let returnValue = yearsCount + '';

                if(yearsCount === 1) returnValue += ' Year';
                else returnValue += ' Years';

                returnValue += ' And ' + monthsCount;
                if(monthsCount === 1) returnValue += ' Month';
                else returnValue += ' Months';
                return returnValue;
            }
        }
    }
}
//#endregion

//#region outer functions
async function prepareInitialExperianceView(experiences: Experience){
    let previouslyUsedCompanyName: string = '';
    return experiences.preparedExperience.map((experience, index) => {
        const contentView = <div className={`${workExperianceStyles.company} ${workExperianceStyles['left-aligned']}`} key={experience.ExperienceID}>
            {previouslyUsedCompanyName !== experience.CompanyName && <CompanyName experiences={experiences} experience={experience} />}
            <div className={workExperianceStyles['position-overlay']}>
                <BulletLinings experience={experience} groupedExperiences={experiences.groupedExperience} />
                <div className={workExperianceStyles.position}>
                    <PositionName experiences={experiences} experience={experience} />
                    <div className={workExperianceStyles['position-details']}>
                        <p>{experience.BriefDescription}</p>
                        <StartEndTimeView experience={experience} />
                        {experience.IsProjectDetailsAvailable && <BriefProjectView experiences={experiences} experience={experience} />}
                    </div>
                </div>
            </div>
            {((experiences.preparedExperience[index + 1] &&
             experiences.preparedExperience[index + 1].CompanyName !== experience.CompanyName &&
             previouslyUsedCompanyName) || (!experiences.preparedExperience[index + 1])) &&
                <div className={workExperianceStyles['technology-brief']}>
                    <div className={workExperianceStyles['bullet-with-line']}></div>
                    <div className={workExperianceStyles.position}>
                        <TechnologyView
                            header={<h3>Technology - Brief</h3>}
                            Technologies={experience.Technologies}
                            TechnologyIDs={experience.TechnologyIDs}
                            experiences={experiences}
                        />
                    </div>
                </div>
            }
        </div>;
        previouslyUsedCompanyName = experience.CompanyName;
        return contentView;
    });
}
//#endregion

//#region Views
function BulletLinings(props: {
    experience: ExperienceViewTypeProps;
    groupedExperiences: Record<string, ExperienceViewTypeProps[]>;
}) {
    // if there are many items to the selected company
    // then we have to add values
    if(props.groupedExperiences[props.experience.CompanyID].length > 1) {
        //if the considering one has more upcoming ones
        if(props.groupedExperiences[props.experience.CompanyID].findIndex(item => item.PositionID === props.experience.PositionID)
            < props.groupedExperiences[props.experience.CompanyID].length - 1) {
            return <div className={workExperianceStyles['bullet-with-line']}>
                <div className={workExperianceStyles.bullet}></div>
                <div className={workExperianceStyles.line}></div>
            </div>;
        }
        //if the considering one is the last
        //one
        else {
            return <div className={workExperianceStyles['bullet-with-line']}>
                <div className={workExperianceStyles.bullet}></div>
            </div>;
        }
    } else {
        return null;
    }
}

function CompanyName(props: {
    experiences: Experience;
    experience: ExperienceViewTypeProps;
}) {
    const formulatedExperience = props.experiences.getFormulatedExperiences({ Type: 'company', CompanyID: props.experience.CompanyID });
    let modifiedCompanyName = props.experience.CompanyName;
    if(formulatedExperience){
        modifiedCompanyName += '(' + formulatedExperience + ')';
    }

    if(props.experience.CompanyID && props.experience.CompanyName && props.experience.LogoImg) {
        return <div className={workExperianceStyles['company-header']}>
            <div className={workExperianceStyles['company-logo']}></div>
            <h2>{modifiedCompanyName}</h2>
        </div>;
    } else if (props.experience.CompanyID > 0 && props.experience.CompanyName) {
        return <div className={workExperianceStyles['company-header']}>
            <h2>{modifiedCompanyName}</h2>
        </div>;
    }
    return <div className={workExperianceStyles['company-header']}>
        <h2>Company Name</h2>
    </div>;
}

function PositionName(props: {
    experiences: Experience;
    experience: ExperienceViewTypeProps;
}) {
    const fomulatedPosition = props.experiences.getFormulatedExperiences({ Type: 'position', CompanyID: props.experience.CompanyID, PositionID: props.experience.PositionID });
    let modifiedPositionName = props.experience.Position;

    if(fomulatedPosition) {
        modifiedPositionName += '(' + fomulatedPosition + ')';
    }
    return <h3>{modifiedPositionName}</h3>;
}

function StartEndTimeView(props: { experience: ExperienceViewTypeProps }){
    const startDate = format(props.experience.StartDate, configs.DateFormat);
    let endDate = null;
    let view = 'Started on ';

    if(props.experience.EndDate) {
        endDate = format(props.experience.EndDate, configs.DateFormat);
    }

    // if there are no end dates
    if(!endDate) {
        view += startDate + ' - Present';
    } else {
        view = 'From ' + startDate + ', To ' + endDate;
    }

    return <h4 className={workExperianceStyles['date-time']}>{view}</h4>;
}

function BriefProjectView(props: {
    experiences: Experience,
    experience: ExperienceViewTypeProps,
}) {
    const { model, silentModel } = usePortfolioModelWithSilent({
        model: {
            ContentView: <Loader  color='#112C11' size={25} />,
            FetchProjects: false,
        },
        silentModel: {
            ExperienceID: 0
        }
    });

    const { collection: projects, helpers: projectHelpers } = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            name: 'Projects',
            fetchFn: () => fetchProjects(silentModel.binders.getValue('ExperienceID')),
            afterFetchTrig: () => model.helpers.binders.setToModel('FetchProjects', false),
        }
    });

    const createProjectView = (projects: ProjectsType[]) => {
        return projects.map(project => {
            return <>
                <h4 key={'ProjectHeader' + project.ProjectID} className={workExperianceStyles.project}>
                    {project.ProjectName}
                </h4>
                <p>{project.Description}</p>
                <TechnologyView
                    header={<h5 className={workExperianceStyles['technology-header']}>Technologies</h5>}
                    Technologies={project.Technologies}
                    TechnologyIDs={project.TechnologyIDs}
                    experiences={props.experiences}
                />
            </>;
        });
    };

    const triggerOnOpenClick = () => {
        if(props.experience.Projects) {
            // we have to create the view since the project has the view
            const View = createProjectView(props.experience.Projects);
            model.helpers.binders.setToModel('ContentView', <div className={workExperianceStyles['project-details']}>
                {View}
            </div>);
        }
        // if the projects are not fetched yet
        // then we have to fetch them
        silentModel.binders.setToModel('ExperienceID', props.experience.ExperienceID);
        model.helpers.binders.setToModel('FetchProjects', true);
    };

    useEffect(() => {
        if(silentModel.silentModelHelper.hasSilentModelChanged('ExperienceID') && model.model.FetchProjects) {
            projectHelpers.fetchCollection();
            silentModel.silentModelHelper.neutrilizeSilentModel('ExperienceID');
        }
    }, [model.model.FetchProjects, projectHelpers, silentModel.silentModelHelper]);

    useEffect(() => {
        if(projects && projects.length > 0) {
            const View = createProjectView(projects);
            model.helpers.binders.setToModel('ContentView', <div className={workExperianceStyles['project-details']}>
                {View}
            </div>);
        }
    }, [projects]);

    return <div className={workExperianceStyles.projects}>
        <H3Rotate HeaderName='Projects' onOpenClick={triggerOnOpenClick}>
            {model.model.ContentView}
        </H3Rotate>
    </div>;
}

function TechnologyView(props: {
    header: ReactNode;
    Technologies: string;
    TechnologyIDs: string;
    experiences: Experience;
}) {
    const View = props.experiences.getTechnologies(props.Technologies, props.TechnologyIDs).map(technology => {
        return <div key={technology.ID} className={workExperianceStyles.technology}>{technology.Technology}</div>;
    });

    return <>
        {props.header}
        <div className={workExperianceStyles.technologies}>
            {View}
        </div>
    </>;
}

function BriefExperienceView(){
    const { model: experienceViewModel, silentModel } = usePortfolioModelWithSilent({
        model: {
            contentView: [<Loader key={0} />],
        },
        silentModel: {
            SelectedExperienceID: 0,
            IsInitialContentViewCreated: false,
            Experiences: new Experience(null)
        }
    });

    const { collection: workExperiences, helpers: workExperienceHelpers } = usePortfolioCollection({
        collection: null,
        helperAttributes: {
            name: 'Work Experiences',
            fetchFn: fetchBriefExperiences,
        },
    });

    /*
    this use effect is responsible for fetching brief experiences whenever the system loaded
    */
    useEffect(() => {
        if(!workExperiences) workExperienceHelpers.fetchCollection();
    }, [workExperienceHelpers, workExperiences]);
    useEffect(() => {
        if(!silentModel.binders.getValue('IsInitialContentViewCreated') && workExperiences && workExperiences.length > 0) {
            silentModel.binders.setToModel('Experiences', new Experience(workExperiences));

            const createContentView = async() => {
                const result = await prepareInitialExperianceView(silentModel.binders.getValue('Experiences'));
                experienceViewModel.helpers.binders.setToModel('contentView', result);
            };
            createContentView();
            silentModel.binders.setToModel('IsInitialContentViewCreated', true);
        }
    }, [silentModel.binders, workExperiences, experienceViewModel.helpers.binders]);

    return experienceViewModel.model.contentView;
}

function DetailedExperienceView() {
    return <h1>Detailed Experience view</h1>;
}

export default function WorkExperience(props: WorkExperiancePropsType) {
    if(props.ViewType === 'brief') {
        return <>
        <HeaderText title='Work Experience' />
        <div className={workExperianceStyles['brief-exp-overlay']}>
            <BriefExperienceView />
        </div>
        </>;
    }
    return <>
        <HeaderText title='Work Experience' />
        <DetailedExperienceView />
    </>;
}
//#endregion